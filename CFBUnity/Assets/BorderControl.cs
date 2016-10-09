using UnityEngine;
using System.Collections;

public class BorderControl : MonoBehaviour {

    public GameObject anchor;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    void OnTriggerExit(Collider other)
    {
        if(other.GetComponent<NoiseBall>())
        {
            other.transform.position.Equals(anchor.transform.position);
        }
    }
}
