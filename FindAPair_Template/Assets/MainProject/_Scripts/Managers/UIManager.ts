import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Color, GameObject, Mathf, Random, Sprite } from 'UnityEngine';
import { RoundedRectangleButton } from 'ZEPETO.World.Gui';

// This class is responsible for controlling everything related to the UI and its interactions.
export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager; // Singleton instance variable

    @Header( "Panels" )
    @SerializeField() startPanel: GameObject; // Reference to the start panel
    @SerializeField() gamePanel: GameObject; // Reference to the game panel 
    @SerializeField() endPanel: GameObject; // Reference to the end panel
    @SerializeField() exitBtn: RoundedRectangleButton;
    
    // Awake is called when an enabled script instance is being loaded.
    Awake () {
        // Singleton pattern
        if ( UIManager.instance != null ) GameObject.Destroy( this.gameObject );
        else UIManager.instance = this;
    }

}