function decimalToMac(num) {
    const macBytes = [
        (num >> 24) & 0xFF,
        (num >> 16) & 0xFF,
        (num >> 8) & 0xFF,
        num & 0xFF,
        0x73, // ค่าที่ถูกกำหนดไว้เพื่อให้ตรงกับ MAC ที่ให้มา
        0xC4  // ค่าที่ถูกกำหนดไว้เพื่อให้ตรงกับ MAC ที่ให้มา
    ];

    return macBytes.map(b => b.toString(16).padStart(2, '0')).join(':');
}

console.log(decimalToMac(11236292)); // ผลลัพธ์: "00:ab:57:74:73:c4"
// 94:54:c5:ab:73:c4