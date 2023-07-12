import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { LocalPlayer, SpawnInfo, UIZepetoPlayerControl, ZepetoCamera, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';
import { GameObject } from 'UnityEngine';

// This script spawns a single player
export default class PlayerSpawner extends ZepetoScriptBehaviour {


    Start () {
        // Grab the user id specified from logging into zepeto through the editor. 
        ZepetoPlayers.instance.CreatePlayerWithUserId( WorldService.userId, new SpawnInfo(), true );
        // ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener( () => {
        //     // const player: LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
        //     let controlUI: UIZepetoPlayerControl = GameObject.FindObjectOfType<UIZepetoPlayerControl>();
        //     console.log( controlUI );
        //     controlUI.gameObject.SetActive( false );
        //     ZepetoPlayers.instance.cameraData.sensitivity = 0;
        //     ZepetoPlayers.instance.cameraData.sensitivity = 5;
        // } );

    }

}