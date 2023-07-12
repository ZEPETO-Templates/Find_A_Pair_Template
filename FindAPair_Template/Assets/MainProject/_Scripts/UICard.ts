import { Sprite } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangle } from 'ZEPETO.World.Gui'
import GameManager from './Managers/GameManager';
import { Button } from 'UnityEngine.UI';

export default class UICard extends ZepetoScriptBehaviour {
    @SerializeField() btnCard: Button;

    public image: RoundedRectangle;
    public id: number;
    public hiddenSprite: Sprite;
    public showingSprite: Sprite;

    Start () {
        this.btnCard.onClick.AddListener( () => {
            this.OnClickCard();
        } );
    }

    OnClickCard () {
        GameManager.instance.SelectCard( this.gameObject );
        this.ShowCard( true );
    }

    public ShowCard ( show: bool ) {
        if ( show )
        {
            this.image.Icon = this.showingSprite;
        }
        else
        {
            this.image.Icon = this.hiddenSprite;
        }
    }
}