import React, { useEffect } from "react"


export const Home = () => {

const cloud_name = import.meta.env.CLOUD_NAME


	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img src="" className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>
			<div className="alert alert-info">

			</div>
		</div>
	);
}; 