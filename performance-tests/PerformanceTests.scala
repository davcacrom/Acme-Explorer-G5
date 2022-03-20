package ass

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class TwoScenarios extends Simulation {
	val httpProtocol = http.baseUrl("http://localhost:8080/v1/")
	val headers_0 = Map("Content-Type" -> "application/json")
    val uri1 = "http://localhost:8080/v1"

	object CreateExplorer {
		val createExplorer1 = exec(http("POST ACTOR-EXPLORER")
			.post("/actors")
			.body(RawFileBody("c:/temp/files/explorer1.json"))
			.headers(headers_0))
		.pause(1)
	}

	object UpdateExplorer {
		val updateExplorer1 = exec(http("PUT ACTOR")
			.put("/actors/6237580680cb74b0ca790f49")
			.body(RawFileBody("c:/temp/files/explorer1.json"))
			.headers(headers_0))
		.pause(2)
	}

	object GetExplorer {
		val getExplorer1 = exec(http("GET ACTOR")
			.get("/actors/6237580680cb74b0ca790f49")
			.headers(headers_0))
		.pause(1)
	}

	object ListTrips {
		val listTrips = exec(http("GET TRIPS")
			.get("/trips/")
			.headers(headers_0))
		.pause(1)

		val searchTrips = exec(http("GET TRIPS BY KEYWORD")
			.get("/trips/?keyword=lorem")
			.headers(headers_0))
		.pause(1)
	}

	object GetTrip {
		val getTrip = exec(http("GET TRIP")
			.get("/trips/622e380670ca329ee563e511")
			.headers(headers_0))
		.pause(1)
	}

	object CreateApplication {
		val createApplication1 = exec(http("POST APPLICATION")
			.post("/trips/622e380670ca329ee563e511/applications")
			.body(RawFileBody("c:/temp/files/application1.json"))
			.headers(headers_0))
		.pause(1)
	}

	object ListApplications {
		val listApplications = exec(http("LIST APPLICATIONS")
			.get("/actors/6237580680cb74b0ca790f49/applications")
			.headers(headers_0))
		.pause(1)
	}

	val explorerScn = scenario("Explorers").exec(
		CreateExplorer.createExplorer1,
		UpdateExplorer.updateExplorer1,
		GetExplorer.getExplorer1,
		ListTrips.listTrips,
		ListTrips.searchTrips,
		GetTrip.getTrip,
		CreateApplication.createApplication1,
		ListApplications.listApplications
	)


	object CreateTrip {
		val createTrip = exec(http("CREATE TRIP")
			.post("/trips")
			.body(RawFileBody("c:/temp/files/trip1.json"))
			.headers(headers_0))
		.pause(1)
	}

	object UpdateTrip {
		val updateTrip = exec(http("UPDATE TRIP")
			.put("/trips/622e3806f0986e9ac2ed6f61")
			.body(RawFileBody("c:/temp/files/tripUpdate1.json"))
			.headers(headers_0))
		.pause(1)
	}

	object DeleteTrip {
		val deleteTrip = exec(http("DELETE TRIP")
			.delete("/trips/622e3806f0986e9ac2ed6f61")
			.headers(headers_0))
		.pause(1)
	}

	object ListTripApplications {
		val listTripApplications = exec(http("LIST TRIP APPLICATIONS")
			.get("/trips/622e38069feaa871ed2ed42e/applications")
			.headers(headers_0))
		.pause(1)
	}

	object UpdateApplication {
		val rejectApplication = exec(http("REJECT APPLICATION")
			.put("/trips/622e3806bd767e92a41e1224/applications/622e37fa3d775f526ab17324")
			.body(RawFileBody("c:/temp/files/rejectApplication.json"))
			.headers(headers_0))
		.pause(1)

		val acceptApplication = exec(http("ACCEPT APPLICATION")
			.put("/trips/622e380646027d64fd65f224/applications/622e37fae199f55834eb0bc5")
			.body(RawFileBody("c:/temp/files/acceptApplication.json"))
			.headers(headers_0))
		.pause(1)
	}

	val managerScn = scenario("Managers").exec(
		CreateTrip.createTrip,
		UpdateTrip.updateTrip,
		DeleteTrip.deleteTrip,
		ListTripApplications.listTripApplications,
		UpdateApplication.rejectApplication,
		UpdateApplication.acceptApplication
	)

	setUp(
		explorerScn.inject(rampUsers(850) during (60 seconds)),
		managerScn.inject(rampUsers(850) during (60 seconds))
		)
		.protocols(httpProtocol)
		.assertions(
			global.responseTime.max.lt(5000),    
			global.responseTime.mean.lt(1000),
			global.successfulRequests.percent.gt(95)
		)
}