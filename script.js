// Enigma 2.0 - Cipher Implementation in JavaScript
// Based on linear algebra matrix transformations

// Character set: space + lowercase a-z + digits 0-9
const O = [' ', ...Array.from('abcdefghijklmnopqrstuvwxyz'), ...'0123456789'.split('')];

/**
 * Encrypts a message using matrix transformations
 * @param {number} key - The numeric encryption key
 * @param {string} message - The message to encrypt
 * @returns {Object} - { encrypted: string, hValues: number[] }
 */
function encryptMessage(key, message) {
    // Convert to lowercase
    message = message.toLowerCase();
    const mList = message.split('');

    const maty = [];

    // Build matrix for each character
    for (let j = 0; j < mList.length; j++) {
        const char = mList[j];
        if (O.includes(char)) {
            const i = O.indexOf(char);
            // Create vector [i, 2*i + j + key, 2*i + 2*j]
            const A = [i, 2 * i + j + key, 2 * i + 2 * j];
            maty.push(A);
        }
    }

    if (maty.length === 0) {
        return { encrypted: '', hValues: [] };
    }

    // Matrix multiplication with [1, 1, 1]
    // Result: sum of each row = i + (2*i + j + key) + (2*i + 2*j) = 5*i + 3*j + key
    const res = maty.map(row => row[0] + row[1] + row[2]);

    // Calculate H values and processed values
    const H = [];
    const processedF = [];
    const modBase = O.length;

    for (const val of res) {
        H.push(Math.floor(val / modBase));
        processedF.push(val % modBase);
    }

    // Map back to characters
    const encryptedChars = processedF.map(val => {
        if (val >= 0 && val < O.length) {
            return O[val];
        }
        return '';
    });

    return {
        encrypted: encryptedChars.join(''),
        hValues: H
    };
}

/**
 * Decrypts a message
 * @param {number} key - The numeric decryption key
 * @param {string} encryptedText - The encrypted message
 * @param {Array|string} hValues - The H values (array or space-separated string)
 * @returns {string} - Decrypted message
 */
function decryptMessage(key, encryptedText, hValues) {
    const m = encryptedText.split('');

    // Parse H values if string
    let hList;
    if (typeof hValues === 'string') {
        hList = hValues.replace(/,/g, ' ').split(/\s+/).filter(x => x).map(x => parseInt(x));
    } else {
        hList = hValues.map(x => parseInt(x));
    }

    if (m.length !== hList.length) {
        throw new Error('Length of encrypted text and H values must match');
    }

    // Reconstruct numeric values
    const A = [];
    for (let j = 0; j < m.length; j++) {
        const char = m[j];
        if (O.includes(char)) {
            const i = O.indexOf(char);
            const a = i + O.length * hList[j];
            A.push(a);
        }
    }

    // Reverse transformation
    // Original: 5*i + 3*j + key = value
    // Solve for i: i = (value - 3*j - key) / 5
    const F = [];
    for (let j = 0; j < A.length; j++) {
        const val = (A[j] - 3 * j - key) / 5;
        F.push(Math.round(val)); // Use round to handle any floating point errors
    }

    // Map back to characters
    const decryptedChars = F.map(val => {
        if (val >= 0 && val < O.length) {
            return O[val];
        }
        return '';
    });

    return decryptedChars.join('');
}

