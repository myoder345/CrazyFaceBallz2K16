/****************************************
	ParticleScaler.js v1.41
	Copyright Unluck Software	
 	www.chemicalbliss.com																			
*****************************************/
class ParticleScaler extends EditorWindow {
	var _scaleMultiplier: float = 1.0;
	var _maxParticleScale: float = 0.5;
	var _maxParticles: int = 50;
	var _origScale: float = 1;
	var _autoRename: boolean;
	@MenuItem("Window/Simple Particle Scaler")
	static function ShowWindow() {
		var win = EditorWindow.GetWindow(ParticleScaler);
		#if UNITY_4_0 || UNITY_4_1 || UNITY_4_2 || UNITY_4_3 || UNITY_4_5 || UNITY_4_6 || UNITY_5_0
			win.title = "Simple Particle Scaler";
		#else
			win.titleContent = new GUIContent("Simple Particle Scaler");
		#endif
		win.minSize = new Vector2(200, 110);
		win.maxSize = new Vector2(200, 110);
	}

	function OnGUI() {
		var _color1: Color32 =  Color32(200, 255, 255, 255);
		var _color2: Color32 = Color32(200, 255, 255, 255);
		var _color4: Color32 = Color32(255, 255, 150, 255);
		var _color3: Color32 = Color32(0, 255, 255, 255);
		var _bigButtonStyle: GUIStyle;
		_bigButtonStyle = new GUIStyle(GUI.skin.button);
		_bigButtonStyle.fixedWidth = 90;
		_bigButtonStyle.fixedHeight = 20;
		_bigButtonStyle.fontSize = 9;
		var _toggleStyle: GUIStyle;
		_toggleStyle = new GUIStyle(GUI.skin.toggle);
		_toggleStyle.fontSize = 9;
		var titleStyle = new GUIStyle(GUI.skin.label);
		titleStyle.fixedWidth = 200;
		EditorGUILayout.Space();
		_scaleMultiplier = EditorGUILayout.Slider(_scaleMultiplier, 0.1, 4.0);
		EditorGUILayout.Space();
		GUI.color = _color3;
		EditorGUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Scale", _bigButtonStyle)) {
				for (var gameObj: GameObject in Selection.gameObjects) {
					gameObj.transform.localScale *= _scaleMultiplier;
					if (this._autoRename) {
						var s = gameObj.name.Split("¤" [0]);
						if (s.Length == 1) {
							gameObj.name += " ¤" + _scaleMultiplier;
						} else {
							var i: float = float.Parse(s[s.Length - 1]);
							gameObj.name = s[0] + "¤" + _scaleMultiplier * i;
						}
					}
					var pss: ParticleSystem[];
					pss = gameObj.GetComponentsInChildren. < ParticleSystem > ();
					for (var ps: ParticleSystem in pss) {
						ps.Stop();
						scalePs(gameObj, ps);
						ps.Play();
					}
				}
			}
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Save Prefabs", _bigButtonStyle)) {
				DoCreateSimplePrefab();
			}
			GUILayout.FlexibleSpace();
		EditorGUILayout.EndHorizontal();
		EditorGUILayout.BeginHorizontal();
			GUILayout.Label("", GUILayout.Width(10));
			_autoRename = GUILayout.Toggle(_autoRename, "Automatic rename", _toggleStyle);
			GUILayout.FlexibleSpace();
			EditorGUILayout.EndHorizontal();
			EditorGUILayout.Space();
			GUI.color = _color1;
			EditorGUILayout.BeginHorizontal();
			if (GUILayout.Button("Play", EditorStyles.miniButtonLeft)) {
				ParticleCalls("Play");
			}
			if (GUILayout.Button("Pause", EditorStyles.miniButtonMid)) {
				ParticleCalls("Pause");
			}
			if (GUILayout.Button("Stop", EditorStyles.miniButtonRight)) {
				ParticleCalls("Stop");
			}
		EditorGUILayout.EndHorizontal();
	}

	function DoCreateSimplePrefab() {
		if (Selection.gameObjects.Length > 0) {
			var path = EditorUtility.SaveFolderPanel("Select Folder ", "Assets/", "");
			if (path.Length > 0) {
				if (path.Contains("" + Application.dataPath)) {
					var s: String = "" + path + "/";
					var d: String = "" + Application.dataPath + "/";
					var p: String = "Assets/" + s.Remove(0, d.Length);
					var objs = Selection.gameObjects;
					var cancel: boolean;
					for (var go: GameObject in objs) {
						if (!cancel) {
							if (AssetDatabase.LoadAssetAtPath(p + go.gameObject.name + ".prefab", GameObject)) {
								var option = EditorUtility.DisplayDialogComplex("Are you sure?", "" + go.gameObject.name + ".prefab" + " already exists. Do you want to overwrite it?", "Yes", "No", "Cancel");
								switch (option) {
									case 0:
										CreateNew(go.gameObject, p + go.gameObject.name + ".prefab");
									case 1:
										break;
									case 2:
										cancel = true;
										break;
									default:
										Debug.LogError("Unrecognized option.");
								}
							} else CreateNew(go.gameObject, p + go.gameObject.name + ".prefab");
						}
					}
				} else {
					Debug.LogError("Prefab Save Failed: Can't save outside project: " + path);
				}
			}
		} else {
			Debug.LogWarning("No GameObjects Selected");
		}
	}
	static
	function CreateNew(obj: GameObject, localPath: String) {
		var prefab: Object = PrefabUtility.CreateEmptyPrefab(localPath);
		PrefabUtility.ReplacePrefab(obj, prefab, ReplacePrefabOptions.ConnectToPrefab);
	}

	function updateParticles() {
		for (var gameObj: GameObject in Selection.gameObjects) {
			var pss: ParticleSystem[];
			pss = gameObj.GetComponentsInChildren. < ParticleSystem > ();
			for (var ps: ParticleSystem in pss) {
				ps.Stop();
				ps.Play();
			}
		}
	}

	function ParticleCalls(call: String) {
		for (var gameObj: GameObject in Selection.gameObjects) {
			var pss: ParticleSystem[];
			pss = gameObj.GetComponentsInChildren. < ParticleSystem > ();
			for (var ps: ParticleSystem in pss) {
				if (call == "Pause") ps.Pause();
				else if (call == "Play") ps.Play();
				else if (call == "Stop") {
					ps.Stop();
					ps.Clear();
				}
			}
		}
	}

	function maxParticles() {
		for (var gameObj: GameObject in Selection.gameObjects) {
			var pss: ParticleSystem[];
			pss = gameObj.GetComponentsInChildren. < ParticleSystem > ();
			for (var ps: ParticleSystem in pss) {
				ps.Stop();
				var sObj: SerializedObject = new SerializedObject(ps);
				sObj.FindProperty("InitialModule.maxNumParticles").intValue = _maxParticles;
				sObj.ApplyModifiedProperties();
				ps.Play();
			}
		}
	}

	function scalePs(__parent: GameObject, __particles: ParticleSystem) {
		if (__parent != __particles.gameObject) {
			__particles.transform.localPosition *= _scaleMultiplier;
		}
		__particles.startSize *= _scaleMultiplier;
		__particles.gravityModifier *= _scaleMultiplier;
		__particles.startSpeed *= _scaleMultiplier;
		var sObj: SerializedObject = new SerializedObject(__particles);
		sObj.FindProperty("ShapeModule.boxX").floatValue *= _scaleMultiplier;
		sObj.FindProperty("ShapeModule.boxY").floatValue *= _scaleMultiplier;
		sObj.FindProperty("ShapeModule.boxZ").floatValue *= _scaleMultiplier;
		sObj.FindProperty("ShapeModule.radius").floatValue *= _scaleMultiplier;
		sObj.FindProperty("VelocityModule.x.scalar").floatValue *= _scaleMultiplier;
		sObj.FindProperty("VelocityModule.y.scalar").floatValue *= _scaleMultiplier;
		sObj.FindProperty("VelocityModule.z.scalar").floatValue *= _scaleMultiplier;
		scaleCurve(sObj.FindProperty("VelocityModule.x.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("VelocityModule.x.maxCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("VelocityModule.y.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("VelocityModule.y.maxCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("VelocityModule.z.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("VelocityModule.z.maxCurve").animationCurveValue);
		sObj.FindProperty("ClampVelocityModule.x.scalar").floatValue *= _scaleMultiplier;
		sObj.FindProperty("ClampVelocityModule.y.scalar").floatValue *= _scaleMultiplier;
		sObj.FindProperty("ClampVelocityModule.z.scalar").floatValue *= _scaleMultiplier;
		sObj.FindProperty("ClampVelocityModule.magnitude.scalar").floatValue *= _scaleMultiplier;
		scaleCurve(sObj.FindProperty("ClampVelocityModule.x.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ClampVelocityModule.x.maxCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ClampVelocityModule.y.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ClampVelocityModule.y.maxCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ClampVelocityModule.z.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ClampVelocityModule.z.maxCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ClampVelocityModule.magnitude.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ClampVelocityModule.magnitude.maxCurve").animationCurveValue);
		sObj.FindProperty("ForceModule.x.scalar").floatValue *= _scaleMultiplier;
		sObj.FindProperty("ForceModule.y.scalar").floatValue *= _scaleMultiplier;
		sObj.FindProperty("ForceModule.z.scalar").floatValue *= _scaleMultiplier;
		scaleCurve(sObj.FindProperty("ForceModule.x.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ForceModule.x.maxCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ForceModule.y.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ForceModule.y.maxCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ForceModule.z.minCurve").animationCurveValue);
		scaleCurve(sObj.FindProperty("ForceModule.z.maxCurve").animationCurveValue);
		sObj.ApplyModifiedProperties();
	}

	function scaleCurve(curve: AnimationCurve) {
		for (var i: int = 0; i < curve.keys.Length; i++) {
			curve.keys[i].value *= _scaleMultiplier;
		}
	}
}