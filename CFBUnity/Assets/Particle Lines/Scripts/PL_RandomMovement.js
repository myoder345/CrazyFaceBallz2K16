#pragma strict

var rp:Vector3;
var counter:int;
var speed:float;

var duplicate:int;
static var duped:boolean;

function Start () {
	if(this.transform.childCount > 0){
	InvokeRepeating("RandomPos", 0, Random.Range(1.1,.3));
	yield(WaitForSeconds(4));
	if(!duped){
	for(var i:int; i < duplicate; i++){	
		Spawn();
	}
		duped=true;
	}
	}else{
		Destroy(gameObject);
	}
}

function RandomPos () {

	rp = Random.insideUnitSphere*30;
	rp.x*=1.25;
	rp.z*=2;
	rp.y*=.87;
	counter=0;
}

function Spawn () {

	yield(WaitForSeconds(Random.value));
	Instantiate(gameObject);
	
	
}

function Update () {
	counter++;
	transform.position = Vector3.Lerp(transform.position, rp, Time.deltaTime*counter*.05*speed);
}