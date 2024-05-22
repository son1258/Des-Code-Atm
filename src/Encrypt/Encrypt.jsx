import React, { useState } from "react";
import "./Encrypt.css";
import CryptoJS from "crypto-js";

const Encrypt = () => { 
  const [pin, setPin] = useState('');
  const [pan, setPan] = useState('');
  const [key, setKey] = useState('');
  const [encryptedPin, setEncryptedPin] = useState('');
  const [userId, setUserId] = useState('');

  //Hàm tạo ra một chuỗi ký tự ngẫu nhiên
  const getRandomHex = (length) => {
    let result = '';
    const characters = '0123456789ABCDEF';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  // Hàm mã hóa 1 khối với trường hợp pass > 8 ký tự
  const encryptBlock = (block, key) => {
    const encrypted = CryptoJS.DES.encrypt(CryptoJS.enc.Hex.parse(block), CryptoJS.enc.Hex.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  };
  // Các ràng buộc
  const handleEncrypt = async () => {
    if (pin.length < 4) {
      alert('PIN phải có ít nhất 4 chữ số');
      return;
    }
    if (pan.length < 16) {
      alert('PAN phải có ít nhất 16 chữ số');
      return;
    }
    if (key.length !== 16) {
      alert('Khóa DES phải có 16 ký tự');
      return;
    }

    //Chia mã pin thành các khối 8 ký tự và mã hóa từng khối
    let result = '';
    for (let i = 0; i < pin.length; i += 8) {
      let block = pin.slice(i, i + 8);
      if (block.length < 8) {
        const randomPadding = getRandomHex(8 - block.length);
        block = block + randomPadding;
      }
      // đệm mã pin với giá trị ngẫu nhiên (đã thực hiện ở trên)
      const paddedPin = block;
      // Lấy 12 chữ số cuối của PAN   
      const panLast12 = pan.slice(-12);
      // XOR giữa mã PIN đệm và PAN
      const xorResult = paddedPin.split('').map((char, i) => {
        return (parseInt(char, 16) ^ parseInt(panLast12[i % 12], 16)).toString(16);
      }).join('');
      // Mã hóa khối với DES
      const encryptedBlock = encryptBlock(xorResult, key);
      result += encryptedBlock;
    }

    setEncryptedPin(result);
};
 return (
    <div>
      <h1>Mã hóa và Lưu trữ mã PIN ATM bằng DES</h1>
      <div className="container">
      <div>
        <label for="pinCode">Mã PIN:</label>
        <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} id="pinCode" name="pinCode"/>
      </div>
      <div>
        <label for="accountNumber">PAN (số tài khoản chính):</label>
        <input type="text" value={pan} onChange={(e) => setPan(e.target.value)} id="accountNumber" name="accountNumber"/>
      </div>
      <div>
        <label for="key">Khóa DES (16 ký tự):</label>
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} id="key" name="key"/>
      </div>
      <div>
        <label for="userID">User ID:</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} id="userID" name="userID"/>
      </div>
      <button onClick={handleEncrypt}>Mã hóa và Lưu trữ</button>
      {encryptedPin && (
        <div className="result">
          <h2>Mã PIN đã mã hóa:</h2>
          <p>{encryptedPin}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Encrypt;