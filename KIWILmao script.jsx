(function(thisObj) {
    scriptBuildUI(thisObj)
    function scriptBuildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window('palette', "KIWILmao", undefined, {
            resizeable: true
        });
        win.spacing = 0;


        // WIN
        // ===
        win.text = "KIWILmao"; 
        win.orientation = "column"; 
        win.alignChildren = ["center","top"]; 
        win.spacing = 10; 
        win.margins = 10; 

        // GROUP1
        // ======
        var group1 = win.add("group", undefined, {name: "group1"}); 
        group1.orientation = "column"; 
        group1.alignChildren = ["left","center"]; 
        group1.spacing = 5; 
        group1.margins = 0; 

        var button1 = group1.add("button", undefined, undefined, {name: "button1"}); 
        button1.text = "Adjustment layer"; 
        button1.preferredSize.width = 128; 

        var button2 = group1.add("button", undefined, undefined, {name: "button2"}); 
        button2.text = "Null layer";
        button2.preferredSize.width = 128; 
        
        var button3 = group1.add("button", undefined, undefined, {name: "button3"}); 
        button3.text = "Time remap";
        button3.preferredSize.width = 128; 

        var button4 = group1.add("button", undefined, undefined, {name: "button4"}); 
        button4.text = "1 Framer";
        button4.preferredSize.width = 128;  

        button1.onClick = function(){                        //adjlayer func
            addAdjLayer();
        }
        function addAdjLayer() {
            app.beginUndoGroup("My Process");
            var comp = app.project.activeItem;
            if(comp == null)
            {
                alert("No composition selected");
            }
            if(comp.selectedLayers[0] == null)
            {
                alert("Select the layer");
            }
            var outpoint = comp.selectedLayers[0].outPoint;
            var inpoint = comp.selectedLayers[0].inPoint;
            var duration = outpoint - inpoint;
            var selectedlayer = comp.selectedLayers[0];
            var solidLayer = comp.layers.addSolid([1,1,1],"Adjustmentlayer",comp.width,comp.height,1,duration);
            solidLayer.adjustmentLayer = true;
            solidLayer.inPoint = inpoint;
            solidLayer.label = 5;
            comp.layer(1).moveBefore(selectedlayer);   
            app.endUndoGroup();
        }
        
        button2.onClick = function(){                       //NullLayer func
            addNullLayer();
        }
        
        function addNullLayer(){
            app.beginUndoGroup("My Process");
            var comp = app.project.activeItem;
            if(comp == null)
            {
                alert("No composition selected");
            }
            if(comp.selectedLayers[0] == null)
            {
                alert("Select the layer");
            }
            var outpoint = comp.selectedLayers[0].outPoint;
            var inpoint = comp.selectedLayers[0].inPoint;
            var duration = outpoint - inpoint;
            var selectedlayer = comp.selectedLayers[0];
            var nullLayer = comp.layers.addNull(duration);
            nullLayer.inPoint = inpoint;
            comp.layer(1).moveBefore(selectedlayer);
            app.endUndoGroup();  
        
        }
        button4.onClick = function(){
            timeLine();
        }
        function timeLine(){
            app.beginUndoGroup("My Process");
            var comp = app.project.activeItem;
            if(comp == null)
            {
                alert("No composition selected");
            }
            var framerate = 1/comp.frameRate;
            var selectedlayer = comp.selectedLayers[0];
            var solidLayer = comp.layers.addSolid([1,1,1],"Adjustmentlayer",comp.width,comp.height,1,framerate);
            solidLayer.adjustmentLayer = true;
            solidLayer.inPoint = comp.time;
            comp.time += framerate;
            solidLayer.label = 5;
            comp.layer(1).moveBefore(selectedlayer);
            app.endUndoGroup(); 
        }
        
        button3.onClick = function() {
            Timeremap();
            
        }
        function Timeremap(){
            app.beginUndoGroup("My Process");
            var comp = app.project.activeItem;
            var selectedLayer = comp.selectedLayers[0]; 
            if(comp == null)
            {
                alert("NO COMP IS SELECTED");
            }
            if(comp.selectedLayers[0] == null)
            {
                alert("SELECT LAYER!!");
            }
            var framerate =1/comp.frameRate;
            var outpoint = selectedLayer.outPoint - framerate;
            var inpoint = selectedLayer.inPoint;
            selectedLayer.timeRemapEnabled = true;
            selectedLayer.property("ADBE Time Remapping").addKey(inpoint);
            selectedLayer.property("ADBE Time Remapping").addKey(outpoint);
            var easeIn = new KeyframeEase(0,25);
            var numKeyframes = selectedLayer.property("ADBE Time Remapping").numKeys;
            var keyTime = selectedLayer.property("ADBE Time Remapping").keyTime(1);
            var valueAtKeyframe = selectedLayer.property("ADBE Time Remapping").valueAtTime(keyTime, true);
            if(numKeyframes == 4){
                selectedLayer.property("ADBE Time Remapping").removeKey(1);
                selectedLayer.property("ADBE Time Remapping").removeKey(3);
                
            }

            else if(numKeyframes == 3 && valueAtKeyframe == 0){
                selectedLayer.property("ADBE Time Remapping").removeKey(3);   
            }
            selectedLayer.property("ADBE Time Remapping").setTemporalEaseAtKey(1, [easeIn]);
            selectedLayer.property("ADBE Time Remapping").setTemporalEaseAtKey(2, [easeIn]);
            comp.frameBlending = true;
            selectedLayer.frameBlendingType = FrameBlendingType.PIXEL_MOTION;

            app.endUndoGroup(); 
        }
        


        
        win.onResizing = win.onResize = function() {
            this.layout.resize();
        };

        win instanceof Window
            ?
            (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());
    }
    
})(this);