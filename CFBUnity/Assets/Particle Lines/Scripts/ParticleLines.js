//	By Unluck Software	
// 	www.chemicalbliss.com																																			

import System.Collections.Generic;	//Used to sort particle system list
#pragma strict
@script RequireComponent(LineRenderer);
var _line:LineRenderer;									//Assign this line renderer
var _ps:ParticleSystem;									//Assign Particle System used for line renderer

//Sorting
var _sortParticleOnLife:boolean;						//Sorts line based on lifetime of particles
var _sortParticleOnDistance:boolean = true;				//Sorts line based on distance from center
var _freezeZeroParticle:boolean = true;					//The first particle will freeze zero position, use to avoid jittering in the front of a moving trail

var _gradients:boolean;									//Enable gradient colors		
var _gradientStart : Gradient;							//Gradient color used over time to change the START color of the line
var _gradientEnd : Gradient;							//Gradient color used over time to change the END color of the line
var _gradientSpeed:float = 1;							//How fast colors are cycled
var _randomGradientStart:boolean;						//Starts the gradient at a random position
var _gradientLight:boolean;								//Apply colors to light

var _light:Light;										//Assign Light used in effect
var _vertexCountIntensity:boolean;						//Use the amount of particles to decide how bright the lights are
var _vertexCountIntensityMultiplier:float = 0.01;		//Multiply the intensity
var _flicker:boolean;									//Flicker intensity based on a animation curve
var _lightFlicker:AnimationCurve;						//Flicker animation curve
var _positionLight:String;								//Position lights based on particle positions
															//"random" = finds a random particle 
															//"end"	= finds a particle in the end of the line
														
var _tileLineMaterial:boolean;							//Enable to tile material attached to line renderer
var _tileMultiplier:float = 1;							//Tile material based on vertex length * multplier
var _fixedTileMaterial:boolean;							//Tiling only based on multiplier
var _tileAnimate:boolean;								//Animate tile material
var _tileAnimateSpeed:float;							//Speed of animation

var _scale:boolean;										//Enable to scale line start and end based on curves
var _startScaleMultiplier:float = 1;					//How much to scale the start of the line
var _startScale:AnimationCurve;							//Start animation curve
var _endScaleMultiplier:float = 1;						//How much to scale the end of the line
var _endScale:AnimationCurve;							//End animation curve
var _scaleSpeed:float = 1;								//Speed of animation based on curves

var _rotationSpeed:Vector3;								//Rotate the particle system to create swirls and spirals (Particles must have start speed)

var _sortInterval:int = 2;								//Each frame sorting occurs (1=always, 2=every other frame ...) 

private var _lineVertex:int;							//Saves how many verts the line uses																																																																																																																																																																																																																																																																																																																																																																															
private var myParticles : ParticleSystem.Particle[];	//Populated with information about each particle
private var myParticlesX : ParticleSystem.Particle[];
private var myParticlesY : ParticleSystem.Particle[];

private var _gradientCounter:float;						//Time counter for cycling colors
private var _randomNumber:float;						//Random value generated at start (Used to avoid uniformed scaling and light flicker on lines that are instantiated on the same frame)
private var _saveLightIntensity:float;					//Saves the initial light intensity at start

var _saveMat:Material;
private var _randomInt:int;

var _cutEndSegments:int;
var _lineResolution:int=150;							//Reduces lenght of line to avoid looping back to start segment
var _currentResolution:int;
var sorted:int;

function Start () {
	if(!_line)	_line 	= transform.GetComponent(LineRenderer);
	if(!_ps)	_ps 	= transform.parent.GetComponent(ParticleSystem);
	if(_light)
	_saveLightIntensity = _light.intensity;
	_randomNumber = Random.value;
	_randomInt = _randomNumber*10;
	_lightFlicker.postWrapMode= WrapMode.Loop;
	_startScale.postWrapMode= WrapMode.Loop;
	_endScale.postWrapMode= WrapMode.Loop;
	if(_randomGradientStart)
	_gradientCounter = _randomNumber;
	
}

function GetFrameCount():int {
	return Time.frameCount + _randomInt;	//Randomize framecount to avoid all instances of ParticleLines to sort on the same frame. (reduce performance spikes)
}

function Compare (first : float, second : float){
	return second.CompareTo (first);
}

function SetLine(){
	for (var j:int; j < _lineVertex -_cutEndSegments; j++){	
		if(myParticlesX && j < myParticlesX.length) 
		_line.SetPosition(j, myParticlesX[j].position);
		else
		_line.SetPosition(j, transform.position);
	}
}

function SortLifetime(){
	CreateLine();
	if(myParticlesX) myParticlesX.Sort(myParticlesX,function(g1,g2) Compare(g1.lifetime, g2.lifetime));
}

function SortDistance(){
	CreateLine();
	if(!myParticlesX) return;
	myParticlesX.Sort(myParticlesX,function(g1,g2) Compare(Vector3.Distance(transform.position, g2.position),Vector3.Distance(transform.position, g1.position)));
	
}

function CreateLine(){	
	if(myParticles.Length == 0) return;
	myParticlesX = new ParticleSystem.Particle[_lineVertex];
	var n:float = myParticles.Length / _lineVertex;
	for(var i:int = 0; i < _lineVertex; i++){
		var nn:int = i*n;
		if(nn < myParticles.Length)myParticlesX[i] = myParticles[nn];
	}
}

function LerpLine(){
	if(myParticles.Length == 0) return;
	var n:float = myParticlesX.Length / _lineVertex;
	for(var i:int = 0; i < myParticlesX.Length; i++){
		var nn:int = i*n;
		myParticlesX[i].position = Vector3.Lerp(myParticlesX[i].position, myParticlesX[Mathf.Min(nn, myParticlesX.Length -1)].position, 1);
	}
}

function SetLineResolution(){
	if(_ps.particleCount < _lineResolution) _lineVertex = myParticles.Length;			
	if(_lineVertex > _lineResolution) _lineVertex = _lineResolution;
	if(_lineVertex < 1) _lineVertex = 1;
	if(_lineVertex != _currentResolution){
	_line.SetVertexCount(Mathf.Max(_lineVertex -_cutEndSegments, 0));		
		if(sorted <= 10){
			SortLifetime();
		 	sorted++;
		}
	}
	_currentResolution = _lineVertex;
}

function LinePos () {
	myParticles = new ParticleSystem.Particle[_ps.particleCount];
	_ps.GetParticles (myParticles);
	SetLineResolution();	
	if(sorted > 10 && _sortInterval > 1 && _sortParticleOnLife && _lineVertex>2){	
		if(GetFrameCount() % _sortInterval ==0)		SortLifetime();	
	}else if(_sortInterval > 1 && _sortParticleOnDistance && _lineVertex>2){
		if(GetFrameCount() % _sortInterval ==0)		SortDistance();	
	}else if(_sortParticleOnLife){	
			SortLifetime();
	}else if(_sortParticleOnDistance){
			SortDistance();
	}else{
		CreateLine();
	}
	if(_freezeZeroParticle && _lineVertex>0)
		if(myParticlesX && myParticlesX.Length > 0)myParticlesX[0].position = this._ps.transform.position;
	
	SetLine();
}

function Update () {
	LinePos ();
	if(_gradients){	
		if(_gradientCounter < 1)		
			_gradientCounter += Time.deltaTime*_gradientSpeed;
		else
			_gradientCounter =0;
		_line.SetColors(_gradientStart.Evaluate(_gradientCounter),_gradientEnd.Evaluate(_gradientCounter) );
		if(_light && _gradientLight){
			_light.color = _gradientStart.Evaluate(_gradientCounter);		
		}
	}
	if(_tileLineMaterial && _fixedTileMaterial){
			_line.GetComponent.<Renderer>().material.mainTextureScale.x = _tileMultiplier;
		}else if(_tileLineMaterial){
			_line.GetComponent.<Renderer>().material.mainTextureScale.x = (_lineVertex)*_tileMultiplier;
		}
	if(_tileAnimate){
			_line.GetComponent.<Renderer>().material.mainTextureOffset.x = (_line.GetComponent.<Renderer>().material.mainTextureOffset.x + _tileAnimateSpeed*Time.deltaTime)%1;
	}
	if(_light){
		if(_positionLight == "end" &&_ps.particleCount>5){
			_light.transform.position = Vector3.Lerp(_light.transform.position, myParticles[_ps.particleCount-6].position, Time.deltaTime*10);	
		}else if(_positionLight == "random" && _ps.particleCount>5){
			_light.transform.position = Vector3.Lerp(_light.transform.position, myParticles[Random.Range(0, _ps.particleCount)].position, Time.deltaTime*2);
		}	
		if(_flicker){
			_light.intensity = _lightFlicker.Evaluate(Time.time+_randomNumber)*_saveLightIntensity;
		}
	}
	if(_scale){						
		var t:float = (Time.time*_scaleSpeed)+_randomNumber;
		_line.SetWidth(_startScale.Evaluate(t)*_startScaleMultiplier, _endScale.Evaluate(t)*_endScaleMultiplier);
	}	
	if(_rotationSpeed.magnitude > 0) 	
		_ps.transform.Rotate(_rotationSpeed*Time.deltaTime);
	
	if(this._vertexCountIntensity)		
		_light.intensity = _saveLightIntensity*this._vertexCountIntensityMultiplier*this._lineVertex;	
}