import { LAppDelegate } from '@/lib/live2d/src/lappdelegate';
import { ResourceModel } from '@/lib/protocol';

export class Live2dManager {
    // 单例
    public static getInstance(): Live2dManager {
        if (! this._instance) {
            this._instance = new Live2dManager();
        }

        return this._instance;
    }

    public setReady(ready: boolean) {
      this._ready = ready;
    }

    public isReady(): boolean {
      return this._ready;
    }

    public changeCharacter(character: ResourceModel | null) {
      // _subdelegates中只有一个画布, 所以设置第一个即可
      this._ready = false;
      LAppDelegate.getInstance().changeCharacter(character)
    }

    public setLipFactor(weight: number): void {
      this._lipFactor = weight;
    }

    public getLipFactor(): number {
      return this._lipFactor;
    }

    public pushAudioQueue(audioData: ArrayBuffer): void {
      this._ttsQueue.push(audioData);
    }

    public popAudioQueue(): ArrayBuffer | null {
      if (this._ttsQueue.length > 0) {
        const audioData = this._ttsQueue.shift();
        return audioData;
      } else {
        return null;
      }
    }

    public clearAudioQueue(): void {
      this._ttsQueue = [];
    }

    public playAudio(): ArrayBuffer | null {
      if (this._audioIsPlaying) return null; // 如果正在播放则返回
      const audioData = this.popAudioQueue();
      if (audioData == null) return null; // 没有音频数据则返回
      this._audioIsPlaying = true;
      // 播放音频
      const playAudioBuffer = (buffer: AudioBuffer) => {
        var source = this._audioContext.createBufferSource();
        source.buffer = buffer;
        
        source.connect(this._audioContext.destination);
        // 监听音频播放完毕事件
        source.onended = () => {
          this._audioIsPlaying = false;
        };
        source.start();
        this._audioSource = source;
      }
      // 创建一个新的 ArrayBuffer 并复制数据, 防止原始数据被decodeAudioData释放
      const newAudioData = audioData.slice(0);
      this._audioContext.decodeAudioData(newAudioData).then(
        buffer => {
          playAudioBuffer(buffer);
        }
      );
      return audioData;
    }

    public stopAudio(): void {
      this.clearAudioQueue();
      if (this._audioSource) {
        this._audioSource.stop();
        this._audioSource = null;
      }
      this._audioIsPlaying = false;
    }

    public isAudioPlaying(): boolean {
      return this._audioIsPlaying;
    }

    constructor() {
      this._audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this._audioIsPlaying = false;
      this._audioSource = null;
      this._lipFactor = 1.0;
      this._ready = false;
    }

    private static _instance: Live2dManager;
    private _ttsQueue: ArrayBuffer[] = [];
    private _audioContext: AudioContext;
    private _audioIsPlaying: boolean;
    private _audioSource: AudioBufferSourceNode | null;
    private _lipFactor: number;
    private _ready: boolean;

    public setEmotion(emotion: string): void {
        const emotionMap: { [key: string]: string } = {
            'happy': '开心',
            'sad': '难过', 
            'surprised': '惊讶',
            'confused': '疑惑',
            'neutral': '微笑'
        };
        
        const expressionName = emotionMap[emotion] || '微笑';
        this.setExpression(expressionName);
    }

    public setExpression(expressionName: string): void {
        const delegate = LAppDelegate.getInstance();
        const subdelegates = delegate.getSubdelegate();
        if (subdelegates && subdelegates.getSize() > 0) {
            const subdelegate = subdelegates.at(0);
            if (subdelegate && subdelegate._view && subdelegate._view._models && subdelegate._view._models.getSize() > 0) {
                const model = subdelegate._view._models.at(0);
                if (model && model._expressionManager) {
                    model._expressionManager.setExpression(expressionName);
                }
            }
        }
    }

    public playMotion(motionName: string): void {
        const delegate = LAppDelegate.getInstance();
        const subdelegates = delegate.getSubdelegate();
        if (subdelegates && subdelegates.getSize() > 0) {
            const subdelegate = subdelegates.at(0);
            if (subdelegate && subdelegate._view && subdelegate._view._models && subdelegate._view._models.getSize() > 0) {
                const model = subdelegate._view._models.at(0);
                if (model && model._motionManager) {
                    model._motionManager.startMotion(motionName, 0, 3);
                }
            }
        }
    }

    public setEmotionWithMotion(emotion: string, intensity: number = 1.0): void {
        this.setEmotion(emotion);
        
        const motionMap: { [key: string]: string } = {
            'happy': intensity > 0.7 ? '开心-眯眼笑着说话' : '微笑-看着你',
            'sad': '难过-叹气看地上',
            'surprised': '惊吓-瞪眼',
            'confused': '疑惑-歪头',
            'neutral': '微笑-平淡'
        };
        
        const motionName = motionMap[emotion] || '微笑-平淡';
        this.playMotion(motionName);
    }

    public updateEmotionFromResponse(response: string, emotion: string): void {
        const intensity = this.analyzeEmotionIntensity(response);
        this.setEmotionWithMotion(emotion, intensity);
    }

    private analyzeEmotionIntensity(response: string): number {
        let intensity = 0.5;
        
        if (response.includes('！') || response.includes('!')) intensity += 0.2;
        if (response.includes('？？') || response.includes('??')) intensity += 0.3;
        if (response.includes('哈哈') || response.includes('呵呵')) intensity += 0.3;
        
        return Math.min(intensity, 1.0);
    }
  }
