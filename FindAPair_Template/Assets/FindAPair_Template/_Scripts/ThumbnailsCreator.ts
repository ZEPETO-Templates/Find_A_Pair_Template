import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldHelper } from 'ZEPETO.World';
import { Texture, Texture2D, Sprite, Rect, Vector2 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { SocialService } from 'ZEPETO.Module.Social';

// WORK IN PROGRESS -------------
// This class will be the Thumbnail generator for the cards based on the friend list
export default class ThumbnailsCreator extends ZepetoScriptBehaviour {
    public userSprites: Sprite[];

    Start () {
        
    }

    public GetUserSprite ( id: string = null ): Sprite {
        ZepetoWorldHelper.GetProfileTexture( id, ( texture: Texture ) => {
            let userSprite = this.GetSprite( texture );
            return userSprite;
        }, ( error ) => {
            console.log( error );
        } );
        return null;
    }

    GetSprite ( texture: Texture ) {
        let rect: Rect = new Rect( 0, 0, texture.width, texture.height );
        return Sprite.Create( texture as Texture2D, rect, new Vector2( 0.5, 0.5 ) );
    }

    *GetFriendList () {
    }
}