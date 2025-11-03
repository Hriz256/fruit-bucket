import '../polyfills/process';
import { _decorator, Component, Node, Prefab, instantiate, UITransform, Sprite, SpriteFrame, screen } from 'cc';
import { defaultGameConfig } from '../config/defaultConfig.ts';
import { buildGameContext } from './GameContext.ts';
import type { GameContext } from './interfaces/GameContext.ts';
import type { IGameEngine } from '../ecs/interfaces/IGameEngine.ts';
import { GameEngine } from './GameEngine.ts';
import { createGameContainer } from './di/createContainer.ts';
import type { ISpawnFactory, SpawnContext, SpawnResult } from '../ecs/interfaces/ISpawnFactory.ts';
import { GameStatus } from '../domain/interfaces/GameState.ts';
import { LivesView } from '../ui/LivesView.ts';
import { ScoreView } from '../ui/ScoreView.ts';
import { TimerView } from '../ui/TimerView.ts';
import { ViewportScaler } from './helpers/ViewportScaler.ts';
import { SpriteCache } from './helpers/SpriteCache.ts';
import { InputAdapter } from './helpers/InputAdapter.ts';
import { GameEventRouter } from './helpers/GameEventRouter.ts';
import { AudioManager } from './AudioManager.ts';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
  @property(Node)
  public basketNode: Node | null = null;

  @property(Node)
  public spawnAnchor: Node | null = null;

  @property(Node)
  public dynamicLayer: Node | null = null;

  @property(Prefab)
  public fallingItemPrefab: Prefab | null = null;

  @property(ScoreView)
  public scoreView: ScoreView | null = null;

  @property(TimerView)
  public timerView: TimerView | null = null;

  @property(LivesView)
  public livesView: LivesView | null = null;

  @property([SpriteFrame])
  public itemSpriteFrames: SpriteFrame[] = [];

  @property(Node)
  public gameOverLayer: Node | null = null;

  @property(AudioManager)
  public audioManager: AudioManager | null = null;

  private _context!: GameContext;
  private _engine!: IGameEngine;
  private _canvasTransform!: UITransform;
  private _basketBaseScaleX = 1;
  private _basketBaseScaleY = 1;
  private _currentGameScale = 1;

  private _viewportScaler!: ViewportScaler;
  private _spriteCache!: SpriteCache;
  private _inputAdapter!: InputAdapter;
  private _eventRouter!: GameEventRouter;

  protected onLoad(): void {
    this._canvasTransform = this.node.getComponent(UITransform)!;
    this._basketBaseScaleX = this.basketNode!.scale.x;
    this._basketBaseScaleY = this.basketNode!.scale.y;
  }

  protected start(): void {
    try {
      const container = createGameContainer(defaultGameConfig);
      this._context = buildGameContext(container);

      this.initializeHelpers();
      this.initEngine();

      this.applyGameplayScale(this._viewportScaler.computeScale());
      this.updateBasketYToBottom();

      this._eventRouter.bind();
      this._inputAdapter.bind();

      if (this.gameOverLayer) {
        this.gameOverLayer.active = false;
      }

      this._context.flow.startNewSession();
    } catch (error) {
      console.error('GameController initialization failed', error);
    }
  }

  protected onEnable(): void {
    screen.on('window-resize', this.onScreenResized, this);
    screen.on('orientation-change', this.onScreenResized, this);
  }

  protected onDisable(): void {
    screen.off('window-resize', this.onScreenResized, this);
    screen.off('orientation-change', this.onScreenResized, this);
  }

  public update(deltaTime: number): void {
    if (this._engine && this._context?.state.snapshot.status === GameStatus.Playing) {
      this._engine.update(deltaTime);
    }
  }

  protected onDestroy(): void {
    this._inputAdapter?.unbind();
    this._eventRouter?.unbind();

    if (this._engine) {
      this._engine.dispose();
    }
  }

  private onNewGameClicked(): void {
    this.gameOverLayer!.active = false;

    this._inputAdapter.unbind();
    this._engine.dispose();

    this.initEngine();

    this._inputAdapter.bind();

    this._context.flow.startNewSession();
  }

  public onStartGameClicked(): void {
    this.onNewGameClicked();
  }

  private initializeHelpers(): void {
    const config = this._context.config;

    this._viewportScaler = new ViewportScaler(
      config.viewport.idealWidth,
      config.viewport.idealHeight,
      config.viewport.minScale,
      config.viewport.maxScale
    );

    this._spriteCache = new SpriteCache();
    this._spriteCache.cacheFrames(this.itemSpriteFrames);

    this._eventRouter = new GameEventRouter(
      this._context,
      this.scoreView,
      this.livesView,
      this.timerView,
      this.gameOverLayer
    );
  }

  private createSpawnFactory(): ISpawnFactory {
    return (world, context: SpawnContext): SpawnResult => {
      const node = instantiate(this.fallingItemPrefab!);
      const parent = this.dynamicLayer ?? this.node;
      parent.addChild(node);
      node.setPosition(context.x, context.y, 0);

      const baseScaleX = node.scale.x;
      const baseScaleY = node.scale.y;
      const scale = this._currentGameScale;
      node.setScale(baseScaleX * scale, baseScaleY * scale, 1);

      const ui = node.getComponent(UITransform)!;
      const sprite = node.getComponent(Sprite);

      if (sprite) {
        const frame = this._spriteCache.get(context.config.spriteFrame);

        if (frame) {
          sprite.spriteFrame = frame;
        } else {
          console.warn(`Sprite frame ${context.config.spriteFrame} not found`);
        }
      }

      const nodeId = this._engine.registerNode(node);

      return {
        nodeId,
        width: ui.contentSize.width * node.scale.x,
        height: ui.contentSize.height * node.scale.y,
      };
    };
  }

  private configureSceneBounds(): void {
    const halfWidth = this._canvasTransform.contentSize.width / 2;
    const halfHeight = this._canvasTransform.contentSize.height / 2;
    const margin = this._context.config.sceneBounds.margin;
    const spawnY = this.spawnAnchor ? this.spawnAnchor.position.y : halfHeight;
    const floorY = -halfHeight - margin / 2;
    const fallDistance = spawnY - floorY;

    this._engine.updateSceneConfig({
      spawnBounds: {
        minX: -halfWidth + margin,
        maxX: halfWidth - margin,
        startY: spawnY,
      },
      inputBounds: {
        minX: -halfWidth + margin,
        maxX: halfWidth - margin,
      },
      floorY,
      fallDistance,
    });
  }

  private registerBasketEntity(): void {
    const ui = this.basketNode!.getComponent(UITransform)!;
    const localPos = this.basketNode!.getPosition();
    const scaleX = this.basketNode!.scale.x;
    const scaleY = this.basketNode!.scale.y;

    const nodeId = this._engine.registerNode(this.basketNode!);
    this._engine.entityFactory.createBasket({
      nodeId,
      x: localPos.x,
      y: localPos.y,
      width: ui.contentSize.width * scaleX,
      height: ui.contentSize.height * scaleY,
      anchorX: ui.anchorPoint.x,
      anchorY: ui.anchorPoint.y,
    });
  }

  private initEngine(): void {
    this._engine = new GameEngine(this._context, {
      spawnFactory: this.createSpawnFactory(),
      onDespawn: this.handleDespawn.bind(this),
      audioPlayer: this.audioManager ?? undefined,
    });

    this._inputAdapter = new InputAdapter(this._engine, this._canvasTransform);

    this.configureSceneBounds();
    this.registerBasketEntity();
  }

  private handleDespawn(nodeId: number): void {
    const node = this._engine.getNode(nodeId);
    node?.destroy();
    this._engine.unregisterNode(nodeId);
  }

  private onScreenResized = (): void => {
    this.scheduleOnce(() => {
      this.configureSceneBounds();
      this.applyGameplayScale(this._viewportScaler.computeScale());
      this.updateBasketYToBottom();
    }, 0);
  };

  private applyGameplayScale(newScale: number): void {
    const oldScale = this._currentGameScale;

    this._currentGameScale = newScale;

    this.basketNode!.setScale(this._basketBaseScaleX * newScale, this._basketBaseScaleY * newScale, 1);
    this.updateBasketBoundsAfterScale();

    const items = this.dynamicLayer?.children ?? [];

    for (const node of items) {
      const ui = node.getComponent(UITransform);

      if (!ui) continue;

      const baseX = node.scale.x / oldScale; 
      const baseY = node.scale.y / oldScale;
      node.setScale(baseX * newScale, baseY * newScale, 1);
    }
  }

  private updateBasketBoundsAfterScale(): void {
    const ui = this.basketNode!.getComponent(UITransform)!;
    const localPos = this.basketNode!.getPosition();
    const scaleX = this.basketNode!.scale.x;
    const scaleY = this.basketNode!.scale.y;

    this._engine.entityFactory.updateBasket({
      x: localPos.x,
      y: localPos.y,
      width: ui.contentSize.width * scaleX,
      height: ui.contentSize.height * scaleY,
      anchorX: ui.anchorPoint.x,
      anchorY: ui.anchorPoint.y,
    });
  }

  private updateBasketYToBottom(): void {
    const basketUI = this.basketNode!.getComponent(UITransform)!;
    const halfH = this._canvasTransform.contentSize.height / 2;
    const scaleY = this.basketNode!.scale.y;
    const scaleX = this.basketNode!.scale.x;
    const anchorY = basketUI.anchorPoint.y;
    const basketH = basketUI.contentSize.height * scaleY;
    const margin = this._context.config.sceneBounds.basketBottomMargin;
    const y = -halfH + anchorY * basketH + margin;
    const current = this.basketNode!.getPosition();

    this.basketNode!.setPosition(current.x, y, current.z);

    this._engine.entityFactory.updateBasket({
      x: current.x,
      y: y,
      width: basketUI.contentSize.width * scaleX,
      height: basketUI.contentSize.height * scaleY,
      anchorX: basketUI.anchorPoint.x,
      anchorY: basketUI.anchorPoint.y,
    });
  }
}
