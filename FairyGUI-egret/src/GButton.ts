
module fairygui {

    export class GButton extends GComponent {
        protected _titleObject: GObject;
        protected _iconObject: GObject;
        protected _relatedController: Controller;

        private _mode: ButtonMode;
        private _selected: boolean;
        private _title: string;
        private _selectedTitle: string;
        private _icon: string;
        private _selectedIcon: string;
        private _sound: string;
        private _soundVolumeScale: number;
        private _pageOption: PageOption;
        private _buttonController: Controller;
        private _changeStateOnClick: boolean;
        private _linkedPopup: GObject;
        private _menuItemGrayed: boolean;

        private _down: boolean;
        private _over: boolean;

        public static UP: string = "up";
        public static DOWN: string = "down";
        public static OVER: string = "over";
        public static SELECTED_OVER: string = "selectedOver";
        public static DISABLED: string = "disabled";

        public constructor() {
            super();

            this._mode = ButtonMode.Common;
            this._title = "";
            this._icon = "";
            this._sound = UIConfig.buttonSound;
            this._soundVolumeScale = UIConfig.buttonSoundVolumeScale;
            this._pageOption = new PageOption();
            this._changeStateOnClick = true;
        }

        public get icon(): string {
            return this._icon;
        }

        public set icon(value: string) {
            this._icon = value;
            value = (this._selected && this._selectedIcon) ? this._selectedIcon : this._icon;
            if(this._iconObject instanceof GLoader)
                (<GLoader>this._iconObject).url = value;
            else if(this._iconObject instanceof GLabel)
                (<GLabel>this._iconObject).icon = value;
            else if(this._iconObject instanceof GButton)
                (<GButton>this._iconObject).icon = value;       
        }

        public get selectedIcon(): string {
            return this._selectedIcon;
        }

        public set selectedIcon(value: string) {
            this._selectedIcon = value;
            value = (this._selected && this._selectedIcon) ? this._selectedIcon : this._icon;
            if(this._iconObject instanceof GLoader)
                (<GLoader>this._iconObject).url = value;
            else if(this._iconObject instanceof GLabel)
                (<GLabel>this._iconObject).icon = value;
            else if(this._iconObject instanceof GButton)
                (<GButton>this._iconObject).icon = value;
        }

        public get title(): string {
            return this._title;
        }

        public set title(value: string) {
            this._title = value;
            if (this._titleObject)
                this._titleObject.text = (this._selected && this._selectedTitle) ? this._selectedTitle : this._title;
        }

        public get text(): string {
            return this.title;
        }

        public set text(value: string) {
            this.title = value;
        }

        public get selectedTitle(): string {
            return this._selectedTitle;
        }

        public set selectedTitle(value: string) {
            this._selectedTitle = value;
            if (this._titleObject)
                this._titleObject.text = (this._selected && this._selectedTitle) ? this._selectedTitle : this._title;
        }

        public get titleColor(): number {
            if(this._titleObject instanceof GTextField)
                return (<GTextField>this._titleObject).color;
            else if(this._titleObject instanceof GLabel)
                return (<GLabel>this._titleObject).titleColor;
            else if(this._titleObject instanceof GButton)
                return (<GButton>this._titleObject).titleColor;
            else
                return 0;
        }

        public set titleColor(value: number) {
            if(this._titleObject instanceof GTextField)
                (<GTextField>this._titleObject).color = value;
            else if(this._titleObject instanceof GLabel)
                (<GLabel>this._titleObject).titleColor = value;
            else if(this._titleObject instanceof GButton)
                (<GButton>this._titleObject).titleColor = value;
        }

        public get sound(): string {
            return this._sound;
        }

        public set sound(val: string) {
            this._sound = val;
        }

        public get soundVolumeScale(): number {
            return this._soundVolumeScale;
        }
        
        public set soundVolumeScale(value: number) {
            this._soundVolumeScale = value;
        }
        
        public get menuItemGrayed(): boolean {
            return this._menuItemGrayed;
        }

        public set menuItemGrayed(val: boolean) {
            if (this._menuItemGrayed != val) {
                this._menuItemGrayed = val;
                if (this._titleObject)
                    this._titleObject.grayed = this._menuItemGrayed;
                if (this._iconObject)
                    this._iconObject.grayed = this._menuItemGrayed;
            }
        }

        public set selected(val: boolean) {
            if (this._mode == ButtonMode.Common)
                return;

            if (this._selected != val) {
                this._selected = val;
                if (this._selected)
                    this.setState(this._over ? GButton.SELECTED_OVER : GButton.DOWN);
                else
                    this.setState(this._over ? GButton.OVER : GButton.UP);
                if (this._selectedTitle)
                    this._titleObject.text = this._selected ? this._selectedTitle : this._title;
                if(this._selectedIcon) {
                    var str: string = this._selected ? this._selectedIcon : this._icon;
                    if(this._iconObject instanceof GLoader)
                        (<GLoader>this._iconObject).url = str;
                    else if(this._iconObject instanceof GLabel)
                        (<GLabel>this._iconObject).icon = str;
                    else if(this._iconObject instanceof GButton)
                        (<GButton>this._iconObject).icon = str;
                }
                if(this._relatedController
                    && this._parent
                    && !this._parent._buildingDisplayList) {
                    if(this._selected)
                        this._relatedController.selectedPageId = this._pageOption.id;
                    else if(this._mode == ButtonMode.Check && this._relatedController.selectedPageId == this._pageOption.id)
                        this._relatedController.oppositePageId = this._pageOption.id;
                }
            }
        }

        public get selected(): boolean {
            return this._selected;
        }

        public get mode(): ButtonMode {
            return this._mode;
        }

        public set mode(value: ButtonMode) {
            if (this._mode != value) {
                if (value == ButtonMode.Common)
                    this.selected = false;
                this._mode = value;
            }
        }

        public get relatedController(): Controller {
            return this._relatedController;
        }

        public set relatedController(val: Controller) {
            if (val != this._relatedController) {
                this._relatedController = val;
                this._pageOption.controller = val;
                this._pageOption.clear();
            }
        }

        public get pageOption(): PageOption {
            return this._pageOption;
        }

        public get changeStateOnClick(): boolean {
            return this._changeStateOnClick;
        }

        public set changeStateOnClick(value: boolean) {
            this._changeStateOnClick = value;
        }

        public get linkedPopup(): GObject {
            return this._linkedPopup;
        }

        public set linkedPopup(value: GObject) {
            this._linkedPopup = value;
        }

        public addStateListener(listener: Function, thisObj: any): void {
            this.addEventListener(StateChangeEvent.CHANGED, listener, thisObj);
        }

        public removeStateListener(listener: Function, thisObj: any): void {
            this.removeEventListener(StateChangeEvent.CHANGED, listener, thisObj);
        }

        public fireClick(downEffect: boolean= true): void {
            if (downEffect && this._mode == ButtonMode.Common) {
                this.setState(GButton.OVER);
                GTimers.inst.add(100, 1, this.setState, this, GButton.DOWN);
                GTimers.inst.add(200, 1, this.setState, this, GButton.UP);
            }
            this.__click(null);
        }

        protected setState(val: string): void {
            if (this._buttonController)
                this._buttonController.selectedPage = val;
        }

        public handleControllerChanged(c: Controller): void {
            super.handleControllerChanged(c);

            if (this._relatedController == c)
                this.selected = this._pageOption.id == c.selectedPageId;
        }
        
        protected handleGrayChanged(): void {
            if(this._buttonController.getPageIdByName(GButton.DISABLED) != null)
                this.setState(GButton.DISABLED);
            else
                super.handleGrayChanged();
        }

        protected constructFromXML(xml: any): void {
            super.constructFromXML(xml);

            xml = ToolSet.findChildNode(xml, "Button");

            var str: string;
            str = xml.attributes.mode;
            if (str)
                this._mode = parseButtonMode(str);
                
            str= xml.attributes.sound;
            if(str != null)
                this._sound = str;
            str = xml.attributes.volume;
            if(str)
                this._soundVolumeScale = parseInt(str) / 100;

            this._buttonController = this.getController("button");
            this._titleObject = this.getChild("title");
            this._iconObject = this.getChild("icon");

            if (this._mode == ButtonMode.Common)
                this.setState(GButton.UP);

            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.__mousedown, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.__click, this);
        }

        public setup_afterAdd(xml: any): void {
            super.setup_afterAdd(xml);

            xml = ToolSet.findChildNode(xml, "Button");
            if (xml) {
                var str: string;
                this.title = xml.attributes.title;
                this.icon = xml.attributes.icon;
                str = xml.attributes.selectedTitle;
                if (str)
                    this.selectedTitle = str;
                str = xml.attributes.selectedIcon;;
                if (str)
                    this.selectedIcon = str;

                str = xml.attributes.titleColor;
                if (str)
                    this.titleColor = ToolSet.convertFromHtmlColor(str);
                str = xml.attributes.controller;
                if (str)
                    this._relatedController = this._parent.getController(xml.attributes.controller);
                else
                    this._relatedController = null;
                this._pageOption.id = xml.attributes.page;
                this.selected = xml.attributes.checked == "true";
            }
        }

        private __rollover(evt: egret.TouchEvent): void {
            if (this._menuItemGrayed)
                return;

            this._over = true;
            if (this._down)
                return;

            this.setState(this._selected ? GButton.SELECTED_OVER : GButton.OVER);
        }

        private __rollout(evt: egret.TouchEvent): void {
            if (this._menuItemGrayed)
                return;

            this._over = false;
            if (this._down)
                return;

            this.setState(this._selected ? GButton.DOWN : GButton.UP);
        }

        private __mousedown(evt: egret.TouchEvent): void {
            this._down = true;
            GRoot.inst.nativeStage.addEventListener(egret.TouchEvent.TOUCH_END, this.__mouseup, this);

            if (this._mode == ButtonMode.Common)
                this.setState(GButton.DOWN);

            if (this._linkedPopup != null) {
                if (this._linkedPopup instanceof Window)
                    (<Window><any> (this._linkedPopup)).toggleStatus();
                else {
                    var r: GRoot = this.root;
                    if (r)
                        r.togglePopup(this._linkedPopup, this);
                }
            }
        }

        private __mouseup(evt: egret.TouchEvent): void {
            if (this._down) {
                GRoot.inst.nativeStage.removeEventListener(egret.TouchEvent.TOUCH_END, this.__mouseup, this);
                this._down = false;

                if (this._over)
                    this.setState(this._selected ? GButton.SELECTED_OVER : GButton.OVER);
                else
                    this.setState(this._selected ? GButton.DOWN : GButton.UP);
            }
        }

        private __click(evt: egret.TouchEvent): void {
            if(this._sound) {
                var pi: PackageItem = UIPackage.getItemByURL(this._sound);
                if (pi) {
                    var sound: egret.Sound = <egret.Sound> pi.owner.getItemAsset(pi);
                    if(sound)
                        GRoot.inst.playOneShotSound(sound,this._soundVolumeScale);
                }
            }

            if (!this._changeStateOnClick || this._menuItemGrayed)
                return;

            if (this._mode == ButtonMode.Check) {
                this.selected = !this._selected;
                this.dispatchEvent(new StateChangeEvent(StateChangeEvent.CHANGED));
            }
            else if (this._mode == ButtonMode.Radio) {
                if (!this._selected) {
                    this.selected = true;
                    this.dispatchEvent(new StateChangeEvent(StateChangeEvent.CHANGED));
                }
            }
        }
    }
}