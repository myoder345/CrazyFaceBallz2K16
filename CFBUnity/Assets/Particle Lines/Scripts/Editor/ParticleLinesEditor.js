//	By Unluck Software	
// 	www.chemicalbliss.com

@CustomEditor(ParticleLines)

public class ParticleLinesEditor extends Editor {
	var options : String[] = ["None", "Lifetime", "Distance"];
	var index : int = 0;
	var sortText : String;							
 	var showHelp:boolean;
 	var optionsLight : String[] = ["None", "Random", "End"];
	var indexLight : int = 0;
 	
 	function OnEnable () {
 		
 		if(target._sortParticleOnLife)			index = 1;
		else if(target._sortParticleOnDistance)	index = 2;
		else									index = 0;
 		CheckIndex();
 		
 		if(target._positionLight == "random")	indexLight = 1;
		else if(target._positionLight == "end")	indexLight = 2;
		else									indexLight = 0;
 		
 		if(!Application.isPlaying){
			if(!target._line)	target._line = target.transform.GetComponent(LineRenderer);
			target._line.SetVertexCount(0);
			if(target._line.GetComponent(Renderer).sharedMaterial != null && target._saveMat != target._line.GetComponent(Renderer).sharedMaterial)
	 		target._saveMat = target._line.GetComponent(Renderer).sharedMaterial;
	 		if(target._line.GetComponent(Renderer).sharedMaterial == null)
	 		target._line.GetComponent(Renderer).sharedMaterial = target._saveMat;
		}
 	}

 	var dColor:Color = Color32(200,200,200,255);
 	var aColor:Color = Color.white;
 	var bColor:Color = Color32(222,222,222,255);
 	
 	var helpColor:Color = Color32(100,100,100,255);
	var helpStyle:GUIStyle;
	
 	var buttonStyle:GUIStyle;
 	override function OnInspectorGUI () {
 		GUI.color = bColor;
 		helpStyle = new GUIStyle(GUI.skin.label);
		
		helpStyle.fontSize = 9;
		helpStyle.normal.textColor = helpColor; 

 		buttonStyle = new GUIStyle(GUI.skin.button);
 		//buttonStyle.normal.textColor = bColor;
 		buttonStyle.fontStyle = FontStyle.Bold;
 		buttonStyle.fixedWidth = 25;
		EditorGUILayout.BeginVertical("Box");
		GUILayout.Space(5);
     	GUI.color = dColor;
     	EditorGUILayout.BeginVertical("Box");   
     	  GUI.color = aColor;


	    	
	    	
	    	target._line = EditorGUILayout.ObjectField("Line Renderer", target._line, typeof(LineRenderer),true) as LineRenderer;
	     	target._ps = EditorGUILayout.ObjectField("Particle System", target._ps, typeof(ParticleSystem),true) as ParticleSystem;
	     	index = EditorGUILayout.Popup("Sorting On Particle", index, options);
	     	if (GUI.changed) {
	     		CheckIndex();
	     	}	
	     	if(target._sortParticleOnLife || target._sortParticleOnDistance){
	     		EditorGUILayout.LabelField(sortText , helpStyle);
		     	EditorGUILayout.LabelField("Sort Interval");
		    	target._sortInterval = EditorGUILayout.Slider(target._sortInterval,0,50);
		    	if(target._sortInterval <= 1){
			    	EditorGUILayout.BeginVertical("Box");
			    	//EditorGUILayout.LabelField("Warning!", EditorStyles.boldLabel);
			    	EditorGUILayout.LabelField("Sorting every frame impacts performance" , EditorStyles.miniBoldLabel);
			    	EditorGUILayout.EndVertical();
		    	}else if(target._sortInterval >= 3){
			    	EditorGUILayout.BeginVertical("Box");
			    	//EditorGUILayout.LabelField("Warning!", EditorStyles.boldLabel);
			    	EditorGUILayout.TextArea("High sorting interval might cause stuttering\nWill tween positions between particles\n(try high number for better performance)" , EditorStyles.miniBoldLabel);
			    	EditorGUILayout.EndVertical();
		    	}
		    	
		    	//GUILayout.Space(10);
	    		if(showHelp) EditorGUILayout.LabelField("Increase performance by limit frame sorting" , helpStyle);
	    		if(showHelp) EditorGUILayout.LabelField("(Higher = Better Performance)" , helpStyle);
	     	}
	     	
	     	target._lineResolution = EditorGUILayout.IntField("_lineResolution", target._lineResolution);
	     	if(target._lineResolution < 10) target._lineResolution=10;
	     	
	     	target._cutEndSegments = EditorGUILayout.IntField("Cut End Segments", target._cutEndSegments);
	     	if(target._cutEndSegments < 0) target._cutEndSegments=0;
	     	
	     	target._freezeZeroParticle = EditorGUILayout.Toggle("Freeze First Segment" , target._freezeZeroParticle);
	     	if(showHelp) EditorGUILayout.LabelField("The first line segment will be centered to particle system" , helpStyle);
	     		     	    	
     	EditorGUILayout.EndVertical();
     	GUILayout.Space(5);
     	
     	
     	GUI.color = dColor;
     	EditorGUILayout.BeginVertical("Box");   
     	GUI.color = aColor;   
	     	target._light = EditorGUILayout.ObjectField("Light Object", target._light, typeof(Light),true) as Light;
	     	if(showHelp) EditorGUILayout.LabelField("Assign Light used in effect" , helpStyle);
	     	if(target._light){
	     		target._vertexCountIntensity = EditorGUILayout.Toggle("Particle Intensity" , target._vertexCountIntensity);
	     		if(showHelp) EditorGUILayout.LabelField("Use the amount of particles to decide how bright the lights are" , helpStyle);
	     		if(target._vertexCountIntensity){
	     			target._vertexCountIntensityMultiplier = EditorGUILayout.FloatField("Intensity Multiplier", target._vertexCountIntensityMultiplier);
	     			if(showHelp) EditorGUILayout.LabelField("Multiply the intensity of the light" , helpStyle);
	     		}
	     		target._flicker = EditorGUILayout.Toggle("Flicker Light" , target._flicker);
	     		if(showHelp) EditorGUILayout.LabelField("Flicker intensity based on a animation curve" , helpStyle);
	     		if(target._flicker){
	     			if(target._lightFlicker.length == 0)
	     			target._lightFlicker = new AnimationCurve(Keyframe(0, 1), Keyframe(1, 1));
	     			
	     			target._lightFlicker = EditorGUILayout.CurveField(target._lightFlicker);   			
	     		}
	     		
	     		indexLight = EditorGUILayout.Popup("Light Position", indexLight, optionsLight);
	     		if(showHelp) EditorGUILayout.LabelField("Position lights based on particle positions" , helpStyle);
	     		if (GUI.changed) {
	     			target._positionLight = optionsLight[indexLight].ToLower();
	     		}
	     		
	     	}
     	EditorGUILayout.EndVertical();
     	GUILayout.Space(5);
     	
     	
     	GUI.color = dColor;
     	EditorGUILayout.BeginVertical("Box");   
     	GUI.color = aColor;       	
	     	if(target._gradients){
	     		if (GUILayout.Button("Gradients (enabled)")) {	
	     			target._gradients = !target._gradients;
	     		}
	     		EditorGUILayout.LabelField("Start Gradient");
	     		target._gradientStart = EditorGUILayout.GradientField(target._gradientStart);
	     		if(showHelp) EditorGUILayout.LabelField("Gradient used over time to change the START color of the line" , helpStyle);
	     		EditorGUILayout.LabelField("End Gradient");
	     		target._gradientEnd = EditorGUILayout.GradientField(target._gradientEnd);
	     		if(showHelp) EditorGUILayout.LabelField("Gradient used over time to change the END color of the line" , helpStyle);
	     		target._gradientSpeed = EditorGUILayout.FloatField("Cycle Speed", target._gradientSpeed);
	     		if(showHelp) EditorGUILayout.LabelField("How fast colors are cycled" , helpStyle);
	     		target._randomGradientStart = EditorGUILayout.Toggle("Random Cycle Start" , target._randomGradientStart);
	     		if(showHelp) EditorGUILayout.LabelField("Starts the gradient at a random position" , helpStyle);
	     		target._gradientLight = EditorGUILayout.Toggle("Gradient Light Color" , target._gradientLight);
	     		if(showHelp) EditorGUILayout.LabelField("Apply gradient colors to light" , helpStyle);
	     	}else{
	     		GUI.color = dColor;
	     		if (GUILayout.Button("Gradients (disabled)")) {	
	     			target._gradients = !target._gradients;
	     		}
	     	}	     	
     	EditorGUILayout.EndVertical();
     	GUILayout.Space(5);
     		
     	
     	
     	
     	
     	GUI.color = dColor;
     	EditorGUILayout.BeginVertical("Box");   
     	GUI.color = aColor;   
	     	if(target._tileLineMaterial){
	     		if (GUILayout.Button("Tile Line Material (enabled)")) {	
	     			target._tileLineMaterial = !target._tileLineMaterial;
	     		}
	     		target._tileMultiplier = EditorGUILayout.FloatField("Tile Multiplier", target._tileMultiplier);
	     		if(showHelp) EditorGUILayout.LabelField("Tile material based on vertex length * multplier" , helpStyle);
	     		target._fixedTileMaterial = EditorGUILayout.Toggle("Fixed Tile Material" , target._fixedTileMaterial);
	     		if(showHelp) EditorGUILayout.LabelField("Tiling only based on multiplier" , helpStyle);
	     		target._tileAnimate = EditorGUILayout.Toggle("Animate Material Tile" , target._tileAnimate);
	     		if(showHelp) EditorGUILayout.LabelField("Animate tiling of material over time" , helpStyle);
	     		if(target._tileAnimate)	target._tileAnimateSpeed = EditorGUILayout.FloatField("Animate Speed", target._tileAnimateSpeed);
	     	}else {
	     		GUI.color = dColor;
	     		if (GUILayout.Button("Tile Line Material (disabled)")) {	
	     			target._tileLineMaterial = !target._tileLineMaterial;
	     		}
	     	}
     	EditorGUILayout.EndVertical();
     	GUILayout.Space(5);
     	
     	
     	GUI.color = dColor;
     	EditorGUILayout.BeginVertical("Box");   
     	GUI.color = aColor;   
	     	if(target._scale){
	     		GUI.color = aColor;  
	     		if (GUILayout.Button("Scale (enabled)")) {	
	     			target._scale = !target._scale;
	     		}
	     		GUI.color = aColor;  
	     		target._startScaleMultiplier = EditorGUILayout.FloatField("Start Scale Multiplier", target._startScaleMultiplier);
	     		if(showHelp) EditorGUILayout.LabelField("How much to scale the start of the line" , helpStyle);
	     		if(target._startScale.length == 0)
	     			target._startScale = new AnimationCurve(Keyframe(0, 1), Keyframe(1, 1));
	     		target._startScale = EditorGUILayout.CurveField(target._startScale);
	     		if(showHelp) EditorGUILayout.LabelField("Start animation curve" , helpStyle);
	     		target._endScaleMultiplier = EditorGUILayout.FloatField("End Scale Multiplier", target._endScaleMultiplier);
	     		if(showHelp) EditorGUILayout.LabelField("How much to scale the end of the line" , helpStyle);
	     		if(target._endScale.length == 0)
	     			target._endScale = new AnimationCurve(Keyframe(0, 1), Keyframe(1, 1));
	     		target._endScale = EditorGUILayout.CurveField(target._endScale);
	     		if(showHelp) EditorGUILayout.LabelField("End animation curve" , helpStyle);
	     		target._scaleSpeed = EditorGUILayout.FloatField("Scale Speed", target._scaleSpeed);
	     		if(showHelp) EditorGUILayout.LabelField("Speed of animation based on curves" , helpStyle);
	     		
	     	}else{
	     		GUI.color = dColor;
	     		if (GUILayout.Button("Scale (disabled)")) {	
	     		target._scale = !target._scale;
	     		}
	     	}
     	EditorGUILayout.EndVertical();
     	GUILayout.Space(5);
     	
     	
     	GUI.color = dColor;
     	EditorGUILayout.BeginVertical("Box");   
     	GUI.color = aColor;   
     		target._rotationSpeed = EditorGUILayout.Vector3Field("Rotation Speed", target._rotationSpeed); 
     		if(showHelp) EditorGUILayout.LabelField("Rotate the particle system to create swirls and spirals" , helpStyle);
     		if(showHelp) EditorGUILayout.LabelField("(Particles must have start speed)" , helpStyle);
		EditorGUILayout.EndVertical();
     	GUILayout.Space(5);
		EditorGUILayout.EndVertical();
		
     	if (GUI.changed){
     		target._line.SetVertexCount(Mathf.Max(target._lineVertex -target._cutEndSegments, 0));
     	  	EditorUtility.SetDirty (target);
     	}
     }
     
     function CheckIndex() {
     	target._sortParticleOnDistance = target._sortParticleOnLife = false;
     	if(index == 1){
     		sortText = "Sorting on lifetime requires more cpu";
     			target._sortParticleOnLife = true;
     			}
     		else if(index == 2){
     			sortText = "Sorting on distance requires alot of cpu";
     			target._sortParticleOnDistance = true;
     			}
     		else{
     			sortText = "";
     		}   
     }
}