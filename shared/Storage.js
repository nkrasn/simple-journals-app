import { AsyncStorage } from 'react-native';
import SimpleCrypto from 'simple-crypto-js';

// May not be very secure to create a key for encryption this way...
// But I'm not looking for anything extremely secure for this
const secretKey = 'P7iwZNzn4ICMKeWhOlwbnCX7X2rRsnZApn3y8awjaSHpAJVcRkpBx62nBHOCd5QwNVQrswukjxAEEsCWTsqQTyB7rxCwG7Q4Q5brBhQFAvgkicAjwm9WlXy0gUrz5HFR';
const crypto = new SimpleCrypto(secretKey);

export default class Storage
{
    static async save(key, data)
    {
        try
        {
            // new Date((new Date().getTime()) - (date.getTimezoneOffset() * 60000)).toISOString();
            // const encryptedData = JSON.stringify(data);
            if(typeof data !== 'string')
                data = JSON.stringify(data);
            await AsyncStorage.setItem(key, data);
        }
        catch(e)
        {
            alert(e);
        }
    }

    static async get(key)
    {
        let data = null;
        
        try
        {
            data = await AsyncStorage.getItem(key);
            if(typeof data === 'string')
                data = JSON.parse(data);
            //alert(data);
        }
        catch(e)
        {
            //alert(e);
        }

        return data;
    }

    static async remove(key)
    {
        try
        {
            await AsyncStorage.removeItem(key);
        }
        catch(e)
        {
            alert(e)
        }
    }

    static async clear()
    {
        try
        {
            await AsyncStorage.clear();
            //alert("Cleared!");
        }
        catch(e)
        {
            alert(e);
        }
    }
}