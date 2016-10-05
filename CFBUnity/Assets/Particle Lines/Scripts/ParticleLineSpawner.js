#pragma strict
import System.Collections.Generic;	//Used to sort particle system list
var particles:GameObject[];			//gameObjects to spawn (used to only be particle systems aka var naming)
var maxButtons:int = 10;			//Maximum buttons per page	
var spawnOnAwake:boolean = true;	//Instantiate the first model on start
var removeTextFromButton:String;	//Unwanted text 
var removeTextFromMaterialButton:String;//Unwanted text 
var autoChangeDelay:float;

private var page:int = 0;			//Current page
private var pages:int;				//Number of pages
private var currentGO:GameObject;	//GameObject currently on stage
private var currentColor:Color;
private var isPS:boolean;			//Toggle to check if this is a PS or a GO
private var _active:boolean = true;
private var counter:int = -1;
var bigStyle: GUIStyle;


function Start(){
    particles.Sort(particles, function(g1,g2) String.Compare(g1.name, g2.name));
	pages = Mathf.Ceil((particles.length -1 )/ maxButtons);
	if(spawnOnAwake){
		counter=0;
		ReplaceGO(particles[counter]);
		}
	if(autoChangeDelay > 0)
		InvokeRepeating("NextModel", autoChangeDelay,autoChangeDelay);
}

function Update () {
	
	if(Input.GetKeyDown(KeyCode.Space)) {
    	if(_active){
    		_active = false;
    	}else{
    		_active = true;
    	}
	}
	if(Input.GetKeyDown(KeyCode.RightArrow)) {
		NextModel ();
	}
	if(Input.GetKeyDown(KeyCode.LeftArrow)) {
		counter--;
		if(counter < 0) counter = particles.Length-1;
		ReplaceGO(particles[counter]);
	}
}

function NextModel () {
		counter++;
		if(counter > particles.Length -1) counter = 0;
		ReplaceGO(particles[counter]);
}

function AddMovement (){
	var move:PL_RandomMovement = currentGO.AddComponent.<PL_RandomMovement>();
	move.speed =3;
}

function OnGUI () {
	if(_active){
	if(particles.length > maxButtons){
		if(GUI.Button(Rect(20,(maxButtons+1)*18,75,18),"Prev"))if(page > 0)page--;else page=pages;
		if(GUI.Button(Rect(95,(maxButtons+1)*18,75,18),"Next"))if(page < pages)page++;else page=0;
		GUI.Label (Rect(60,(maxButtons+2)*18,150,22), "Page" + (page+1) + " / " + (pages+1));	
	}
		if(GUI.Button(Rect(20,(maxButtons+3)*18,150,18),"Add Movement")){
			AddMovement();
		}
	
	var pageButtonCount:int = particles.length - (page*maxButtons);
	if(pageButtonCount > maxButtons)pageButtonCount = maxButtons;
	
	for(var i:int=0;i < pageButtonCount;i++){
		var buttonText:String = particles[i+(page*maxButtons)].transform.name;
		if(removeTextFromButton != "")
		buttonText = buttonText.Replace(removeTextFromButton, "");
		if(GUI.Button(Rect(20,i*18+18,150,18),buttonText)){
			if(currentGO) Destroy(currentGO);
			var go:GameObject = Instantiate(particles[i+page*maxButtons]);
			currentGO = go;
			counter = i + (page * maxButtons);
		}
	}
	}
}

function ReplaceGO (_go:GameObject){
		if(currentGO) Destroy(currentGO);
			var go:GameObject = Instantiate(_go);
			currentGO = go;
}

function PlayPS (_ps:ParticleSystem, _nr:int){
		Time.timeScale = 1;
		_ps.Play();		
}