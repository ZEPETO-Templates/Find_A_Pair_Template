import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { LocalPlayer, SpawnInfo, UIZepetoPlayerControl, ZepetoCamera, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';
import { GameObject } from 'UnityEngine';
import ThumbnailsCreator from './MainProject/_Scripts/ThumbnailsCreator';

// This script spawns a single player
export default class PlayerSpawner extends ZepetoScriptBehaviour {

    // @SerializeField() thumbnailsCreatorObj: GameObject;
    private thumbnailsCreator: ThumbnailsCreator;
    Start () {
        // this.thumbnailsCreator = this.thumbnailsCreatorObj.GetComponent<ThumbnailsCreator>();
        // Grab the user id specified from logging into zepeto through the editor. 
        ZepetoPlayers.instance.CreatePlayerWithUserId( WorldService.userId, new SpawnInfo(), true );
        // ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener( () => {
        //     const player: LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
        //     this.thumbnailsCreator.Setup( player.zepetoPlayer.userId );

        // } );

    }

    
}