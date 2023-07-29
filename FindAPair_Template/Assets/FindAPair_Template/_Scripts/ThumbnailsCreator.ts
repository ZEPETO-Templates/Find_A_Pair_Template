import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldHelper } from 'ZEPETO.World';
import { Texture, Texture2D, Sprite, Rect, Vector2, SerializeReference, Debug } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { MyFollowingListResponse } from 'ZEPETO.Module.Social';
import { BaseResponse } from 'ZEPETO.Module';

// WORK IN PROGRESS -------------
// This class will be the Thumbnail generator for the cards based on the friend list
export default class ThumbnailsCreator extends ZepetoScriptBehaviour {

    public userId: string;
    public sampleImage: Image;

    public Setup ( id: string = null ) {
        this.userId = id ? id : ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId;

        ZepetoWorldHelper.GetProfileTexture( this.userId, ( texture: Texture ) => {
            this.sampleImage.sprite = this.GetSprite( texture );

        }, ( error ) => {
            console.log( error );
        } );
    }

    Start () {
        this.GetFriendList();
    }

    GetSprite ( texture: Texture ) {
        let rect: Rect = new Rect( 0, 0, texture.width, texture.height );
        return Sprite.Create( texture as Texture2D, rect, new Vector2( 0.5, 0.5 ) );
    }

    GetFriendList () {

    }
}