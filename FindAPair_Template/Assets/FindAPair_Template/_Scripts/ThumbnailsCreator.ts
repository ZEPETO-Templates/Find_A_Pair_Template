import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldHelper } from 'ZEPETO.World';
import { Texture, Texture2D, Sprite, Rect, Vector2, WaitUntil } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { SocialService } from 'ZEPETO.Module.Social';

// WORK IN PROGRESS -------------
// This class will be the Thumbnail generator for the cards based on the friend list
export default class ThumbnailsCreator extends ZepetoScriptBehaviour {
    public userSprites: Sprite[];

    private usersIds: string[];
    Start () {
        this.usersIds = [];
        this.userSprites = [];
        this.StartCoroutine( this.GetFriendList() );
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
        var request = SocialService.GetMyFollowingListAsync();

        yield new WaitUntil( () => false == request.keepWaiting );

        if ( request.responseData.isSuccess )
        {
            var userList = request.responseData.users;
            userList.forEach( user => {
                this.usersIds.push( user.userId );
            } );

            this.usersIds.forEach( id => {
                this.userSprites.push( this.GetUserSprite( id ) );
            } );
        } else
        {
            // If the request fails, print the error message.
            console.log( `GetFollowerList Failed : ${ request.responseData.message }` );
        }

    }
}