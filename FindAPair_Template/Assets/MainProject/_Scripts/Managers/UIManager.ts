import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Color, GameObject, Mathf, Random, Sprite, WaitForSeconds } from 'UnityEngine';
import { RoundedRectangleButton, ZepetoText } from 'ZEPETO.World.Gui';

// This class is responsible for controlling everything related to the UI and its interactions.
export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager; // Singleton instance variable

    @Header( "Panels" )
    @SerializeField() startPanel: GameObject; // Reference to the start panel
    @SerializeField() gamePanel: GameObject; // Reference to the game panel 
    @SerializeField() endPanel: GameObject; // Reference to the end panel

    @Header( "References" )
    @SerializeField() playBtn: RoundedRectangleButton;
    @SerializeField() exitBtn: RoundedRectangleButton;
    @SerializeField() counterObj: GameObject;
    @SerializeField() counterText: ZepetoText;

    @Header( "Settings" )
    @SerializeField() timeToStart: number;

    // Awake is called when an enabled script instance is being loaded.
    Awake () {
        // Singleton pattern
        if ( UIManager.instance != null ) GameObject.Destroy( this.gameObject );
        else UIManager.instance = this;
    }

    Start () {
        this.SetButtonsLogic();
    }

    SetButtonsLogic () {
        this.playBtn.OnClick.AddListener( () => {
            this.StartCoroutine( this.WaitToStart() );
        } );
    }

    *WaitToStart () {
        let counter: number = this.timeToStart;
        this.counterObj.SetActive( true );
        while ( counter > 0 )
        {
            this.counterText.text = counter.toString();
            yield new WaitForSeconds( 1 );
            counter--;
            this.counterText.text = counter.toString();
        }
        this.counterText.text = "Start!";
        yield new WaitForSeconds( 1 );
        this.counterObj.SetActive( false );
        this.startPanel.SetActive( false );
        this.gamePanel.SetActive( true );
    }

}