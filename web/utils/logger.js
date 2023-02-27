import cls from "cls-hooked"
import uuid from "node-uuid"
import util from "util"
import winston from "winston"
import { Logtail } from "@logtail/node"
import { LogtailTransport } from "@logtail/winston"
import * as dotenv from "dotenv"
dotenv.config()

const { combine, errors, timestamp, json, cli, printf, prettyPrint, simple } = winston.format

let logtail = null
if (process.env.NODE_ENV === "production") {
	logtail = new Logtail(process.env.LOGTAIL_TOKEN)
}


const tracerFormat = printf((info) => {
	const myRequest = cls.getNamespace("tracing")
	const requestId = myRequest?.get("requestId") || null

	if (requestId) info.requestId = requestId

	return info
})

// Logs objects better
// Make sure to spread object like logger.info("Object:", {...object})
const utilFormat = printf((info, opts) => {
	const args = info[Symbol.for("splat")]
	if (args) {
		info.message = util.format(info.message, ...args)
	}
	return info
})

export const logger = winston.createLogger({
	level: "debug", // Only use debug, info, warn and error
	format: combine(
		errors({ stack: true }),
		timestamp(),
		tracerFormat,
		utilFormat,
		json()
	),
	exitOnError: false,
})

if (process.env.NODE_ENV === "development") {
	logger.add(
		new winston.transports.Console({
			format: combine(errors({ stack: true }), cli()),
			handleExceptions: true,
			handleRejections: true,
		})
	)
} else if (logtail) {
	logger.add(
		new LogtailTransport(logtail, {
			level: "debug",
			handleExceptions: true,
			handleRejections: true,
		})
	)
}

export const setupTracing = (app) => {
	const tracingNamespace = cls.createNamespace("tracing")

	app.use((req, res, next) => {
		tracingNamespace.bindEmitter(req)
		tracingNamespace.bindEmitter(res)

		tracingNamespace.run(() => {
			const id = uuid.v1()
			cls.getNamespace("tracing").set("requestId", id)
			res.setHeader("requestId", id)
			next()
		})
	})
}
