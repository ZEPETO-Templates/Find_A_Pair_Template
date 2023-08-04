import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldHelper } from 'ZEPETO.World';
import { Texture, Texture2D, Sprite, Rect, Vector2, WaitUntil } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { SocialService } from 'ZEPETO.Module.Social';

// WORK IN PROGRESS -------------
// This class will be the Thumbnail generator for the cards based on the friend list
export default class ThumbnailsCreator extends ZepetoScriptBehaviour {
    public userSprites: Sprite[]; // This variable will save the sprites of the follows of the user
    private usersIds: string[]; // This variable saves the userIds of the follows of the user

    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
    Start () {
        // Initialize the arrays
        this.usersIds = [];
        this.userSprites = [];

        // Call to the coroutine to get the sprites of the follows
        this.StartCoroutine( this.CreateFollowingSprites() );
    }

    // This function creates the sprite of the user passed by parameter and returns it
    GetUserSprite ( id: string = null ): Sprite {
        // Here we use the ZepetoWorldHelper to get a texture from the user id https://docs.zepeto.me/studio-world/docs/user_information
        ZepetoWorldHelper.GetProfileTexture( id, ( texture: Texture ) => {
            // We save the sprite getting it from the GetSprite function
            let userSprite = this.GetSprite( texture );
            // Then push the sprite to the userSprites array
            this.userSprites.push( userSprite );
            // And return it
            return userSprite;

            // If you get an error
        }, ( error ) => {
            // Then log the error on the console
            console.log( error );
        } );
        // And return null when you got an error
        return null;
    }

    // This function create and return an sprite receiving a texture as parameter
    GetSprite ( texture: Texture ): Sprite {
        // Save the Rect creating it by the size of the texture
        let rect: Rect = new Rect( 0, 0, texture.width, texture.height );
        // Then return the creation of the sprite based on the texture
        return Sprite.Create( texture as Texture2D, rect, new Vector2( 0.5, 0.5 ) );
    }

    // This function send a request to get the following list of the user
    *CreateFollowingSprites () {
        //
        var request = SocialService.GetMyFollowingListAsync();

        yield new WaitUntil( () => false == request.keepWaiting );

        if ( request.responseData.isSuccess )
        {
            var userList = request.responseData.users;
            userList.forEach( user => {
                this.usersIds.push( user.userId );
            } );

            this.usersIds.forEach( id => {
                this.GetUserSprite( id );
            } );
        } else
        {
            // If the request fails, print the error message.
            console.log( `GetFollowerList Failed : ${ request.responseData.message }` );
        }

    }
}