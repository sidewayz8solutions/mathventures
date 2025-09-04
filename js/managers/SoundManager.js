class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.isMuted = false;
    }
    
    preload() {
        // Using placeholder base64 encoded sounds for demo
        // In production, replace with actual sound files
        
        // Background music
        this.scene.load.audio('bgMusic', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBgFbrdDh8aFaFA0ybbrn77VpHQU7k9ryx3ovBRdss+zyt28gBQ==');
        
        this.scene.load.audio('titleMusic', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBgFbrdDh8aFaFA0ybbrn77VpHQU7k9ryx3ovBRdss+zyt28gBQ==');
        
        this.scene.load.audio('bossMusic', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBgFbrdDh8aFaFA0ybbrn77VpHQU7k9ryx3ovBRdss+zyt28gBQ==');
        
        // Sound effects
        this.scene.load.audio('jump', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N==');
        
        this.scene.load.audio('spell', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBg==');
        
        this.scene.load.audio('collect', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp==');
        
        this.scene.load.audio('victory', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H==');
        
        this.scene.load.audio('damage', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBgFbrdDh8aFaFA==');
        
        this.scene.load.audio('powerup', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBg==');
        
        this.scene.load.audio('correct', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBgFbrdDh8aFaFA0ybbrn77VpHQU7k9ryx3ovBRdss+zyt28gBQ==');
        
        this.scene.load.audio('wrong', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBg==');
        
        this.scene.load.audio('battle', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBg==');
        
        this.scene.load.audio('firework', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLaizsIHGS57OihUBEOVKzn775iHAU2jdXy0H0vBgFbrdDh8aFaFA0ybbrn77VpHQU7k9ryx3ovBRdss+zyt28gBQ==');
    }
    
    create() {
        // Create all sound objects
        const soundList = [
            'bgMusic', 'titleMusic', 'bossMusic',
            'jump', 'spell', 'collect', 'victory',
            'damage', 'powerup', 'correct', 'wrong',
            'battle', 'firework'
        ];
        
        soundList.forEach(key => {
            if (this.scene.cache.audio.exists(key)) {
                const isMusic = key.includes('Music');
                this.sounds[key] = this.scene.sound.add(key, {
                    loop: isMusic,
                    volume: isMusic ? this.musicVolume : this.sfxVolume
                });
            }
        });
        
        // Create sound control UI
        this.createSoundControls();
    }
    
    createSoundControls() {
        // Mute button
        const muteButton = this.scene.add.text(
            GameConfig.GAME_WIDTH - 50, 50,
            '🔊', {
            fontSize: '32px'
        }).setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .setDepth(1000);
        
        muteButton.on('pointerdown', () => {
            this.toggleMute();
            muteButton.setText(this.isMuted ? '🔇' : '🔊');
        });
        
        // Volume controls (optional - more complex)
        this.muteButton = muteButton;
    }
    
    play(soundName, config = {}) {
        if (this.sounds[soundName] && !this.isMuted) {
            // Stop if already playing (for non-looping sounds)
            if (!soundName.includes('Music') && this.sounds[soundName].isPlaying) {
                this.sounds[soundName].stop();
            }
            
            // Apply config if provided
            if (config.volume !== undefined) {
                this.sounds[soundName].volume = config.volume;
            }
            
            this.sounds[soundName].play();
        }
    }
    
    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].stop();
        }
    }
    
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.isPlaying) {
                sound.stop();
            }
        });
    }
    
    pauseAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.isPlaying) {
                sound.pause();
            }
        });
    }
    
    resumeAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.isPaused) {
                sound.resume();
            }
        });
    }
    
    fadeIn(soundName, duration = 1000) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].volume = 0;
            this.sounds[soundName].play();
            
            this.scene.tweens.add({
                targets: this.sounds[soundName],
                volume: soundName.includes('Music') ? this.musicVolume : this.sfxVolume,
                duration: duration
            });
        }
    }
    
    fadeOut(soundName, duration = 1000) {
        if (this.sounds[soundName]) {
            this.scene.tweens.add({
                targets: this.sounds[soundName],
                volume: 0,
                duration: duration,
                onComplete: () => {
                    this.sounds[soundName].stop();
                }
            });
        }
    }
    
    crossFade(fromSound, toSound, duration = 1000) {
        this.fadeOut(fromSound, duration);
        this.fadeIn(toSound, duration);
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.pauseAll();
        } else {
            this.resumeAll();
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
        
        Object.entries(this.sounds).forEach(([key, sound]) => {
            if (key.includes('Music') && sound) {
                sound.volume = this.musicVolume;
            }
        });
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
        
        Object.entries(this.sounds).forEach(([key, sound]) => {
            if (!key.includes('Music') && sound) {
                sound.volume = this.sfxVolume;
            }
        });
    }
    
    playRandomPitch(soundName, minPitch = 0.8, maxPitch = 1.2) {
        if (this.sounds[soundName]) {
            const pitch = Phaser.Math.FloatBetween(minPitch, maxPitch);
            this.sounds[soundName].setRate(pitch);
            this.play(soundName);
            
            // Reset pitch after playing
            this.scene.time.delayedCall(100, () => {
                this.sounds[soundName].setRate(1);
            });
        }
    }
    
    destroy() {
        this.stopAll();
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.destroy();
            }
        });
    }
}