import { Injectable } from '@angular/core';
import { KJUR } from 'jsrsasign';

@Injectable({
  providedIn: 'root'
})
export class VideotokenService {

  constructor() { }

  generateVideoToken(
    sdkKey= "FcUHdiWMrHFeqQd5jKJqWQz6nOXWQHJDjlua",
    sdkSecret= "sn9Vc2mln3urlQIBjE9USoczbOeiJEQcz9CG",
    topic: string,
    passWord = '',
    sessionKey = '',
    userIdentity = '',){

      let signature = '';
    try {
      const iat = Math.round(new Date().getTime() / 1000);
      const exp = iat + 60 * 60 * 2;

      // Header
      const oHeader = { alg: 'HS256', typ: 'JWT' };
      // Payload
      const oPayload = {
        app_key: sdkKey,
        iat,
        exp,
        tpc: topic,
        pwd: passWord,
        user_identity: userIdentity,
        session_key: sessionKey,
        // topic
      };
      // Sign JWT, password=616161
      const sHeader = JSON.stringify(oHeader);
      const sPayload = JSON.stringify(oPayload);
      signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);
  } catch (e) {
    console.error(e);
  }
  return signature;

  }

}