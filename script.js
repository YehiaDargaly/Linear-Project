// Simple Enigma-inspired encryption (educational purposes only)
class EnigmaSimulator {
    constructor() {
        this.rotorPositions = [0, 0, 0];
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // Simplified rotor wirings (not historically accurate)
        this.rotors = [
            'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
            'AJDKSIRUXBLHWTMCQGZNPYFVOE',
            'BDFHJLCPRTXVZNYEIWGAKMUSQO'
        ];
        
        this.reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
    }
    
    rotatRotors() {
        this.rotorPositions[2]++;
        
        if (this.rotorPositions[2] >= 26) {
            this.rotorPositions[2] = 0;
            this.rotorPositions[1]++;
        }
        
        if (this.rotorPositions[1] >= 26) {
            this.rotorPositions[1] = 0;
            this.rotorPositions[0]++;
        }
        
        if (this.rotorPositions[0] >= 26) {
            this.rotorPositions[0] = 0;
        }
        
        this.updateRotorDisplay();
    }
    
    updateRotorDisplay() {
        document.getElementById('rotor1-pos').textContent = this.alphabet[this.rotorPositions[0]];
        document.getElementById('rotor2-pos').textContent = this.alphabet[this.rotorPositions[1]];
        document.getElementById('rotor3-pos').textContent = this.alphabet[this.rotorPositions[2]];
    }
    
    encryptChar(char) {
        if (!this.alphabet.includes(char)) {
            return char;
        }
        
        this.rotatRotors();
        
        let index = this.alphabet.indexOf(char);
        
        // Pass through rotors (forward)
        for (let i = 2; i >= 0; i--) {
            index = (index + this.rotorPositions[i]) % 26;
            index = this.alphabet.indexOf(this.rotors[i][index]);
        }
        
        // Reflector
        index = this.alphabet.indexOf(this.reflector[index]);
        
        // Pass through rotors (backward)
        for (let i = 0; i < 3; i++) {
            index = this.rotors[i].indexOf(this.alphabet[index]);
            index = (index - this.rotorPositions[i] + 26) % 26;
        }
        
        return this.alphabet[index];
    }
    
    processMessage(message) {
        return message.toUpperCase()
            .split('')
            .map(char => this.encryptChar(char))
            .join('');
    }
    
    reset() {
        this.rotorPositions = [0, 0, 0];
        this.updateRotorDisplay();
    }
}

// Global enigma instance
let enigma = new EnigmaSimulator();

// Smooth scrolling
function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Encrypt message
function encryptMessage() {
    const input = document.getElementById('message-input').value;
    
    if (!input.trim()) {
        alert('Please enter a message to encrypt');
        return;
    }
    
    enigma.reset();
    const encrypted = enigma.processMessage(input);
    document.getElementById('message-output').value = encrypted;
    
    // Add animation
    const outputField = document.getElementById('message-output');
    outputField.style.animation = 'none';
    setTimeout(() => {
        outputField.style.animation = 'fadeInUp 0.5s ease';
    }, 10);
}

// Decrypt message
function decryptMessage() {
    const input = document.getElementById('message-input').value;
    
    if (!input.trim()) {
        alert('Please enter a message to decrypt');
        return;
    }
    
    // Enigma is symmetric - encryption and decryption are the same process
    enigma.reset();
    const decrypted = enigma.processMessage(input);
    document.getElementById('message-output').value = decrypted;
    
    // Add animation
    const outputField = document.getElementById('message-output');
    outputField.style.animation = 'none';
    setTimeout(() => {
        outputField.style.animation = 'fadeInUp 0.5s ease';
    }, 10);
}

// Clear messages
function clearMessages() {
    document.getElementById('message-input').value = '';
    document.getElementById('message-output').value = '';
    enigma.reset();
}

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize rotor display
    enigma.updateRotorDisplay();
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
            alert('🎉 You found the secret! The Enigma code has been cracked!');
        }, 2000);
    }
});

// Rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
