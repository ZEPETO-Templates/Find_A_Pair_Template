import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldHelper } from 'ZEPETO.World';
import { Texture, Texture2D, Sprite, Rect, Vector2, WaitUntil } from 'UnityEngine';
import { SocialService } from 'ZEPETO.Module.Social';

// You can use this class to use thumbnails of your followings in the game
// This class will be the Thumbnail generator for the cards based on the friend list
export default class ThumbnailsCreator extends ZepetoScriptBehaviour {
    private userSprites: Sprite[]; // This variable will save the sprites of the follows of the user
    private usersIds: string[]; // This variable saves the userIds of the follows of the user

    private spritesToLoad: number = 0; // Variable to know the amount of sprites that has to be loaded
    public spritesLoaded: bool = false; // Flag to know if the sprites are all loaded

    public GetUserSprites(): Sprite[] {
        return this.userSprites;
    }

    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
    Start() {
        // Initialize the arrays
        this.usersIds = [];
        this.userSprites = [];

        // Call to the coroutine to get the sprites of the follows
        this.StartCoroutine(this.CreateFollowingSprites());
    }

    // This function creates the sprite of the user passed by parameter and returns it
    GetUserSprite(id: string = null): Sprite {
        // Here we use the ZepetoWorldHelper to get a texture from the user id https://docs.zepeto.me/studio-world/docs/user_information
        ZepetoWorldHelper.GetProfileTexture(id, (texture: Texture) => {

            // We save the sprite getting it from the GetSprite function
            let userSprite = this.GetSprite(texture);

            // Then push the sprite to the userSprites array
            this.userSprites.push(userSprite);

            // Rest one sprite to load
            this.spritesToLoad--;

            // Check if all the sprites are loaded and change the flag
            if (this.spritesToLoad == 0) this.spritesLoaded = true;

            // And return it
            return userSprite;

            // If you get an error
        }, (error) => {
            // Then log the error on the console
            console.log(error);
            // Rest one sprite to load
            this.spritesToLoad--;
        });
        // And return null when you got an error
        return null;
    }

    // This function create and return an sprite receiving a texture as parameter
    GetSprite(texture: Texture): Sprite {
        // Save the Rect creating it by the size of the texture
        let rect: Rect = new Rect(0, 0, texture.width, texture.height);
        // Then return the creation of the sprite based on the texture
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }

    // This function send a request to get the following list of the user and create the sprites with them
    *CreateFollowingSprites() {
        // There we make a request to get the following list
        var request = SocialService.GetMyFollowingListAsync();

        // We wait until the request finish 
        yield new WaitUntil(() => false == request.keepWaiting);

        // Then if the request is succsess
        if (request.responseData.isSuccess) {
            // We save the list of the users on the variable
            var userList = request.responseData.users;

            // Then we get a sprite for each userid
            userList.forEach(user => {
                // Add one sprite to load
                this.spritesToLoad++;

                // Call to the function to create the sprite passing the userId
                this.GetUserSprite(user.userId);
            });

        } else {
            // If the request fails, print the error message.
            console.log(`GetFollowerList Failed : ${request.responseData.message}`);
        }
    }
}