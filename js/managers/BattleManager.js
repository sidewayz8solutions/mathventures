class BattleManager {
    constructor(scene) {
        this.scene = scene;
        this.currentEnemy = null;
        this.modal = document.getElementById('math-modal');
        this.questionEl = document.getElementById('math-question');
        this.buttonsEl = document.getElementById('answer-buttons');
        this.currentProblem = null;
        this.streak = 0;
        this.timeLimit = null;
        this.timer = null;
        
        // Create timer display
        this.createTimerDisplay();
    }
    
    createTimerDisplay() {
        if (!document.getElementById('timer-display')) {
            const timerDiv = document.createElement('div');
            timerDiv.id = 'timer-display';
            timerDiv.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 36px;
                font-family: 'Fredoka';
                color: #FFD700;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                display: none;
                z-index: 1001;
            `;
            this.modal.appendChild(timerDiv);
        }
        this.timerDisplay = document.getElementById('timer-display');
    }
    
    startBattle(enemy) {
        this.currentEnemy = enemy;
        this.scene.physics.pause();
        
        // Dramatic battle start effect
        this.scene.cameras.main.zoomTo(1.2, 300);
        this.scene.cameras.main.flash(200, 100, 100, 255);
        
        // Generate problem based on enemy difficulty
        const problem = this.generateProblem();
        this.currentProblem = problem;
        
        // Start timer based on level
        const config = GameConfig.MATH_CONFIG[this.scene.currentLevel];
        this.timeLimit = config.timeLimit;
        
        // Show modal with animation
        this.showMathModal(problem);
        
        // Play battle music/sound
        if (this.scene.soundManager) {
            this.scene.soundManager.play('battle');
        }
    }
    
    generateProblem() {
        const config = GameConfig.MATH_CONFIG[this.scene.currentLevel] || GameConfig.MATH_CONFIG[1];
        const operations = config.operations;
        
        // For boss enemies, make harder problems
        const isBoss = this.currentEnemy && this.currentEnemy.isBoss;
        const difficulty = isBoss ? 1.5 : 1;
        
        const operation = operations.includes('all') ? 
            ['add', 'subtract', 'multiply', 'divide'][Math.floor(Math.random() * 4)] :
            operations[Math.floor(Math.random() * operations.length)];
        
        let a = Math.floor(Math.random() * (config.max - config.min + 1) * difficulty) + config.min;
        let b = Math.floor(Math.random() * (config.max - config.min + 1) * difficulty) + config.min;
        let answer, symbol, question;
        
        switch(operation) {
            case 'add':
                answer = a + b;
                symbol = '+';
                question = `${a} ${symbol} ${b} = ?`;
                break;
                
            case 'subtract':
                // Ensure positive result
                if (b > a) [a, b] = [b, a];
                answer = a - b;
                symbol = '-';
                question = `${a} ${symbol} ${b} = ?`;
                break;
                
            case 'multiply':
                // Smaller numbers for multiplication
                a = Math.floor(a / 3);
                b = Math.floor(b / 3);
                answer = a * b;
                symbol = '×';
                question = `${a} ${symbol} ${b} = ?`;
                break;
                
            case 'divide':
                // Ensure clean division
                answer = Math.floor(Math.random() * 15) + 2;
                b = Math.floor(Math.random() * 10) + 2;
                a = answer * b;
                symbol = '÷';
                question = `${a} ${symbol} ${b} = ?`;
                break;
        }
        
        // For variety, sometimes use word problems
        if (Math.random() < 0.3) {
            question = this.createWordProblem(a, b, operation, answer);
        }
        
        // Generate wrong answers that are believable
        const answers = [answer];
        const variations = [
            answer + 1, answer - 1,
            answer + 2, answer - 2,
            answer + 10, answer - 10,
            answer * 2, Math.floor(answer / 2),
            a + a, b + b,
            a - b, b - a
        ];
        
        while (answers.length < 4) {
            const wrong = variations[Math.floor(Math.random() * variations.length)];
            if (!answers.includes(wrong) && wrong >= 0) {
                answers.push(wrong);
            }
        }
        
        // Shuffle answers
        answers.sort(() => Math.random() - 0.5);
        
        return {
            question: question,
            correctAnswer: answer,
            answers: answers,
            operation: operation,
            bonus: config.bonusPoints
        };
    }
    
    createWordProblem(a, b, operation, answer) {
        const wordProblems = {
            add: [
                `You have ${a} magic gems.\nYou find ${b} more.\nHow many gems do you have now?`,
                `${a} friendly slimes join your party.\n${b} more arrive.\nHow many slimes total?`,
                `You cast ${a} spells in the morning.\nAnd ${b} spells in the afternoon.\nHow many spells in total?`
            ],
            subtract: [
                `You have ${a} health potions.\nYou use ${b} of them.\nHow many are left?`,
                `There are ${a} enemies.\nYou defeat ${b} of them.\nHow many remain?`,
                `You collect ${a} coins.\nYou spend ${b} coins.\nHow many coins do you have?`
            ],
            multiply: [
                `Each treasure chest has ${a} coins.\nYou open ${b} chests.\nHow many coins total?`,
                `Each spell does ${a} damage.\nYou cast it ${b} times.\nTotal damage?`,
                `${a} groups of ${b} crystals.\nHow many crystals in total?`
            ],
            divide: [
                `You have ${a} gems to share.\nAmong ${b} friends equally.\nHow many gems each?`,
                `${a} enemies in ${b} equal groups.\nHow many per group?`,
                `${a} magic points divided into\n${b} spells equally.\nPoints per spell?`
            ]
        };
        
        const problems = wordProblems[operation] || [`${a} ? ${b} = ${answer}`];
        return problems[Math.floor(Math.random() * problems.length)];
    }
    
    showMathModal(problem) {
        this.modal.style.display = 'block';
        this.modal.classList.add('math-modal');
        
        // Reset modal state
        this.questionEl.innerHTML = '';
        this.buttonsEl.innerHTML = '';
        
        // Create question display with animation
        const questionLines = problem.question.split('\n');
        questionLines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = line;
            lineDiv.style.opacity = '0';
            lineDiv.style.transform = 'translateY(20px)';
            this.questionEl.appendChild(lineDiv);
            
            // Animate in
            setTimeout(() => {
                lineDiv.style.transition = 'all 0.5s';
                lineDiv.style.opacity = '1';
                lineDiv.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Create answer buttons with stagger animation
        problem.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.innerHTML = `
                <span style="font-size: 36px;">${answer}</span>
                <span style="font-size: 18px; display: block; opacity: 0.7;">
                    ${this.getAnswerHint(answer, problem.correctAnswer)}
                </span>
            `;
            button.style.opacity = '0';
            button.style.transform = 'scale(0)';
            
            button.onclick = () => this.checkAnswer(answer, problem.correctAnswer);
            this.buttonsEl.appendChild(button);
            
            // Animate button appearance
            setTimeout(() => {
                button.style.transition = 'all 0.3s';
                button.style.opacity = '1';
                button.style.transform = 'scale(1)';
            }, 500 + index * 100);
        });
        
        // Start timer
        this.startTimer();
        
        // Show streak if exists
        if (this.streak > 0) {
            this.showStreak();
        }
    }
    
    getAnswerHint(answer, correct) {
        // Provide subtle hints for younger players
        const hints = [
            '🤔 Think carefully!',
            '💭 Is this right?',
            '✨ Maybe?',
            '🎯 Could be!'
        ];
        
        if (Math.abs(answer - correct) <= 1) {
            return '🔥 So close!';
        } else if (answer === correct) {
            return '⭐ Feels right!';
        }
        
        return hints[Math.floor(Math.random() * hints.length)];
    }
    
    startTimer() {
        this.timerDisplay.style.display = 'block';
        let timeLeft = this.timeLimit;
        
        this.timerDisplay.textContent = `⏱️ ${timeLeft}`;
        
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                timeLeft--;
                this.timerDisplay.textContent = `⏱️ ${timeLeft}`;
                
                // Change color as time runs out
                if (timeLeft <= 5) {
                    this.timerDisplay.style.color = '#FF0000';
                    this.timerDisplay.style.animation = 'pulse 0.5s infinite';
                } else if (timeLeft <= 10) {
                    this.timerDisplay.style.color = '#FFFF00';
                }
                
                if (timeLeft <= 0) {
                    this.timeUp();
                }
            },
            repeat: this.timeLimit - 1
        });
    }
    
    timeUp() {
        // Auto-select wrong answer
        this.checkAnswer(-1, this.currentProblem.correctAnswer);
    }
    
    checkAnswer(selected, correct) {
        // Stop timer
        if (this.timer) {
            this.timer.remove();
        }
        this.timerDisplay.style.display = 'none';
        
        const buttons = this.buttonsEl.querySelectorAll('.answer-btn');
        const isCorrect = selected === correct;
        
        // Disable all buttons
        buttons.forEach(btn => {
            btn.disabled = true;
            const value = parseInt(btn.querySelector('span').textContent);
            
            if (value === correct) {
                btn.classList.add('correct');
                // Celebration animation
                this.createButtonCelebration(btn);
            } else if (value === selected) {
                btn.classList.add('wrong');
                // Shake animation
                btn.style.animation = 'wrongAnswer 0.5s';
            }
        });
        
        // Update streak
        if (isCorrect) {
            this.streak++;
            this.showSuccess();
        } else {
            this.streak = 0;
            this.showFailure();
        }
        
        // Close modal and resolve battle
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.modal.style.transform = 'translate(-50%, -50%) scale(0)';
            
            // Reset zoom
            this.scene.cameras.main.zoomTo(1, 300);
            
            if (isCorrect) {
                this.victory();
            } else {
                this.defeat();
            }
            
            this.scene.physics.resume();
        }, 2000);
    }
    
    createButtonCelebration(button) {
        // Stars burst from button
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.innerHTML = '⭐';
            star.style.cssText = `
                position: absolute;
                font-size: 24px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 1002;
            `;
            button.appendChild(star);
            
            const angle = (Math.PI * 2 / 8) * i;
            const distance = 100;
            
            star.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 1
                },
                {
                    transform: `translate(
                        calc(-50% + ${Math.cos(angle) * distance}px),
                        calc(-50% + ${Math.sin(angle) * distance}px)
                    ) scale(1.5)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => star.remove();
        }
    }
    
    showSuccess() {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 72px;
            font-family: 'Fredoka';
            font-weight: bold;
            color: #00FF00;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
            z-index: 1003;
            pointer-events: none;
        `;
        
        const messages = [
            'AWESOME! 🎉',
            'BRILLIANT! ⭐',
            'FANTASTIC! 🌟',
            'SUPER! 💫',
            'AMAZING! 🎊'
        ];
        
        successMsg.textContent = messages[Math.floor(Math.random() * messages.length)];
        this.modal.appendChild(successMsg);
        
        // Animate message
        successMsg.animate([
            { 
                transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                opacity: 0
            },
            {
                transform: 'translate(-50%, -50%) scale(1.5) rotate(360deg)',
                opacity: 1
            },
            {
                transform: 'translate(-50%, -50%) scale(1) rotate(360deg)',
                opacity: 1
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => successMsg.remove();
        
        // Play success sound
        if (this.scene.soundManager) {
            this.scene.soundManager.play('correct');
        }
    }
    
    showFailure() {
        const failMsg = document.createElement('div');
        failMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            font-family: 'Fredoka';
            color: #FF0000;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 1003;
            pointer-events: none;
        `;
        
        const messages = [
            'Try Again! 💪',
            'Keep Going! 🎯',
            'Almost! 🌟',
            "Don't Give Up! 💖"
        ];
        
        failMsg.textContent = messages[Math.floor(Math.random() * messages.length)];
        this.modal.appendChild(failMsg);
        
        // Shake animation
        failMsg.animate([
            { transform: 'translate(-50%, -50%) translateX(0)' },
            { transform: 'translate(-50%, -50%) translateX(-10px)' },
            { transform: 'translate(-50%, -50%) translateX(10px)' },
            { transform: 'translate(-50%, -50%) translateX(-10px)' },
            { transform: 'translate(-50%, -50%) translateX(10px)' },
            { transform: 'translate(-50%, -50%) translateX(0)' }
        ], {
            duration: 500
        }).onfinish = () => failMsg.remove();
        
        // Play failure sound
        if (this.scene.soundManager) {
            this.scene.soundManager.play('wrong');
        }
    }
    
    showStreak() {
        const streakDiv = document.createElement('div');
        streakDiv.style.cssText = `
            position: absolute;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 32px;
            font-family: 'Fredoka';
            color: #FFD700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 1002;
        `;
        
        streakDiv.innerHTML = `🔥 Streak: ${this.streak} 🔥`;
        this.modal.appendChild(streakDiv);
        
        // Animate streak
        streakDiv.animate([
            { transform: 'translateX(-50%) scale(0)', opacity: 0 },
            { transform: 'translateX(-50%) scale(1.2)', opacity: 1 },
            { transform: 'translateX(-50%) scale(1)', opacity: 1 }
        ], {
            duration: 500,
            easing: 'bounce'
        });
        
        // Remove after delay
        setTimeout(() => streakDiv.remove(), 3000);
    }
    
    victory() {
        if (this.currentEnemy) {
            // Calculate bonus points
            const bonusPoints = this.currentProblem.bonus * Math.max(1, this.streak);
            this.scene.score += this.currentEnemy.points + bonusPoints;
            this.scene.updateHUD();
            
            // Enemy defeat animation
            this.currentEnemy.finalDefeat();
            
            // Reward player
            this.scene.player.mana = Math.min(
                this.scene.player.mana + 1,
                this.scene.player.maxMana
            );
            
            // Random chance for health
            if (Math.random() < 0.3) {
                this.scene.player.heal(1);
            }
            
            this.scene.updateHUD();
            
            // Check if level complete
            if (this.scene.enemies.countActive() === 1) { // Current enemy about to be destroyed
                this.scene.time.delayedCall(1500, () => {
                    if (this.scene.portal) {
                        this.scene.portal.activate();
                    }
                });
            }
        }
    }
    
    defeat() {
        // Enemy escapes and recovers
        if (this.currentEnemy && !this.currentEnemy.isDead) {
            this.currentEnemy.clearTint();
            this.currentEnemy.body.enable = true;
            this.currentEnemy.isDead = false;
            this.currentEnemy.health = Math.min(
                this.currentEnemy.health + 1,
                this.currentEnemy.maxHealth
            );
            
            // Enemy taunts
            const taunt = this.scene.add.text(
                this.currentEnemy.x,
                this.currentEnemy.y - 60,
                '😈 Too slow!',
                {
                    fontFamily: 'Fredoka',
                    fontSize: '24px',
                    color: '#FF0000'
                }
            ).setOrigin(0.5);
            
            this.scene.tweens.add({
                targets: taunt,
                y: taunt.y - 30,
                alpha: 0,
                duration: 2000,
                onComplete: () => taunt.destroy()
            });
            
            // Player takes damage
            this.scene.player.takeDamage(1);
        }
    }
    
    destroy() {
        if (this.timer) {
            this.timer.remove();
        }
    }
}