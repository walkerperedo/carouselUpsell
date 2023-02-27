import { SkeletonThumbnail } from "@shopify/polaris"
import React, { useState } from "react"
import { useParams } from "react-router-dom"

const currencyCodeMap = {
	"AED": {
		"symbol": "AED",
		"code": "AED",
		"symbol_native": "د.إ.\u200F",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"AFN": {
		"symbol": "AFN",
		"code": "AFN",
		"symbol_native": "؋",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"ALL": {
		"symbol": "ALL",
		"code": "ALL",
		"symbol_native": "Lekë",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"AMD": {
		"symbol": "AMD",
		"code": "AMD",
		"symbol_native": "֏",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"ANG": {
		"symbol": "ANG",
		"code": "ANG",
		"symbol_native": "NAf.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"AOA": {
		"symbol": "AOA",
		"code": "AOA",
		"symbol_native": "Kz",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"ARS": {
		"symbol": "ARS",
		"code": "ARS",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"AUD": {
		"symbol": "A$",
		"code": "AUD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"AWG": {
		"symbol": "AWG",
		"code": "AWG",
		"symbol_native": "Afl.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"AZN": {
		"symbol": "AZN",
		"code": "AZN",
		"symbol_native": "\u20BC",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BAM": {
		"symbol": "BAM",
		"code": "BAM",
		"symbol_native": "КМ",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BBD": {
		"symbol": "BBD",
		"code": "BBD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BDT": {
		"symbol": "BDT",
		"code": "BDT",
		"symbol_native": "৳",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BGN": {
		"symbol": "BGN",
		"code": "BGN",
		"symbol_native": "лв.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BHD": {
		"symbol": "BHD",
		"code": "BHD",
		"symbol_native": "د.ب.\u200F",
		"decimal_digits": 3,
		"rounding": 0.0
	},
	"BIF": {
		"symbol": "BIF",
		"code": "BIF",
		"symbol_native": "FBu",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"BMD": {
		"symbol": "BMD",
		"code": "BMD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BND": {
		"symbol": "BND",
		"code": "BND",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BOB": {
		"symbol": "BOB",
		"code": "BOB",
		"symbol_native": "Bs",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BOV": {
		"symbol": "BOV",
		"code": "BOV",
		"symbol_native": "BOV",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BRL": {
		"symbol": "R$",
		"code": "BRL",
		"symbol_native": "R$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BSD": {
		"symbol": "BSD",
		"code": "BSD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BTN": {
		"symbol": "BTN",
		"code": "BTN",
		"symbol_native": "Nu.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BWP": {
		"symbol": "BWP",
		"code": "BWP",
		"symbol_native": "P",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BYN": {
		"symbol": "BYN",
		"code": "BYN",
		"symbol_native": "Br",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"BZD": {
		"symbol": "BZD",
		"code": "BZD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CAD": {
		"symbol": "CA$",
		"code": "CAD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CDF": {
		"symbol": "CDF",
		"code": "CDF",
		"symbol_native": "FC",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CHE": {
		"symbol": "CHE",
		"code": "CHE",
		"symbol_native": "CHE",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CHF": {
		"symbol": "CHF",
		"code": "CHF",
		"symbol_native": "CHF",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CHW": {
		"symbol": "CHW",
		"code": "CHW",
		"symbol_native": "CHW",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CLF": {
		"symbol": "CLF",
		"code": "CLF",
		"symbol_native": "CLF",
		"decimal_digits": 4,
		"rounding": 0.0
	},
	"CLP": {
		"symbol": "CLP",
		"code": "CLP",
		"symbol_native": "$",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"CNH": {
		"symbol": "CNH",
		"code": "CNH",
		"symbol_native": "CNH",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CNY": {
		"symbol": "CN¥",
		"code": "CNY",
		"symbol_native": "¥",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"COP": {
		"symbol": "COP",
		"code": "COP",
		"symbol_native": "$",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"COU": {
		"symbol": "COU",
		"code": "COU",
		"symbol_native": "COU",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CRC": {
		"symbol": "CRC",
		"code": "CRC",
		"symbol_native": "\u20A1",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CUC": {
		"symbol": "CUC",
		"code": "CUC",
		"symbol_native": "CUC",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CUP": {
		"symbol": "CUP",
		"code": "CUP",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CVE": {
		"symbol": "CVE",
		"code": "CVE",
		"symbol_native": "\u200B",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"CZK": {
		"symbol": "CZK",
		"code": "CZK",
		"symbol_native": "Kč",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"DJF": {
		"symbol": "DJF",
		"code": "DJF",
		"symbol_native": "Fdj",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"DKK": {
		"symbol": "DKK",
		"code": "DKK",
		"symbol_native": "kr.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"DOP": {
		"symbol": "DOP",
		"code": "DOP",
		"symbol_native": "RD$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"DZD": {
		"symbol": "DZD",
		"code": "DZD",
		"symbol_native": "د.ج.\u200F",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"EGP": {
		"symbol": "EGP",
		"code": "EGP",
		"symbol_native": "ج.م.\u200F",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"ERN": {
		"symbol": "ERN",
		"code": "ERN",
		"symbol_native": "Nfk",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"ETB": {
		"symbol": "ETB",
		"code": "ETB",
		"symbol_native": "ብር",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"EUR": {
		"symbol": "\u20AC",
		"code": "EUR",
		"symbol_native": "\u20AC",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"FJD": {
		"symbol": "FJD",
		"code": "FJD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"FKP": {
		"symbol": "FKP",
		"code": "FKP",
		"symbol_native": "£",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"GBP": {
		"symbol": "£",
		"code": "GBP",
		"symbol_native": "£",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"GEL": {
		"symbol": "GEL",
		"code": "GEL",
		"symbol_native": "\u20BE",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"GHS": {
		"symbol": "GHS",
		"code": "GHS",
		"symbol_native": "GH\u20B5",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"GIP": {
		"symbol": "GIP",
		"code": "GIP",
		"symbol_native": "£",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"GMD": {
		"symbol": "GMD",
		"code": "GMD",
		"symbol_native": "D",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"GNF": {
		"symbol": "GNF",
		"code": "GNF",
		"symbol_native": "FG",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"GTQ": {
		"symbol": "GTQ",
		"code": "GTQ",
		"symbol_native": "Q",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"GYD": {
		"symbol": "GYD",
		"code": "GYD",
		"symbol_native": "$",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"HKD": {
		"symbol": "HK$",
		"code": "HKD",
		"symbol_native": "HK$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"HNL": {
		"symbol": "HNL",
		"code": "HNL",
		"symbol_native": "L",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"HRK": {
		"symbol": "HRK",
		"code": "HRK",
		"symbol_native": "HRK",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"HTG": {
		"symbol": "HTG",
		"code": "HTG",
		"symbol_native": "G",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"HUF": {
		"symbol": "HUF",
		"code": "HUF",
		"symbol_native": "Ft",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"IDR": {
		"symbol": "IDR",
		"code": "IDR",
		"symbol_native": "Rp",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"ILS": {
		"symbol": "\u20AA",
		"code": "ILS",
		"symbol_native": "\u20AA",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"INR": {
		"symbol": "\u20B9",
		"code": "INR",
		"symbol_native": "\u20B9",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"IQD": {
		"symbol": "IQD",
		"code": "IQD",
		"symbol_native": "د.ع.\u200F",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"IRR": {
		"symbol": "IRR",
		"code": "IRR",
		"symbol_native": "IRR",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"ISK": {
		"symbol": "ISK",
		"code": "ISK",
		"symbol_native": "ISK",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"JMD": {
		"symbol": "JMD",
		"code": "JMD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"JOD": {
		"symbol": "JOD",
		"code": "JOD",
		"symbol_native": "د.أ.\u200F",
		"decimal_digits": 3,
		"rounding": 0.0
	},
	"JPY": {
		"symbol": "¥",
		"code": "JPY",
		"symbol_native": "￥",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"KES": {
		"symbol": "KES",
		"code": "KES",
		"symbol_native": "Ksh",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"KGS": {
		"symbol": "KGS",
		"code": "KGS",
		"symbol_native": "сом",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"KHR": {
		"symbol": "KHR",
		"code": "KHR",
		"symbol_native": "៛",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"KMF": {
		"symbol": "KMF",
		"code": "KMF",
		"symbol_native": "CF",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"KPW": {
		"symbol": "KPW",
		"code": "KPW",
		"symbol_native": "KPW",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"KRW": {
		"symbol": "\u20A9",
		"code": "KRW",
		"symbol_native": "\u20A9",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"KWD": {
		"symbol": "KWD",
		"code": "KWD",
		"symbol_native": "د.ك.\u200F",
		"decimal_digits": 3,
		"rounding": 0.0
	},
	"KYD": {
		"symbol": "KYD",
		"code": "KYD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"KZT": {
		"symbol": "KZT",
		"code": "KZT",
		"symbol_native": "\u20B8",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"LAK": {
		"symbol": "LAK",
		"code": "LAK",
		"symbol_native": "\u20AD",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"LBP": {
		"symbol": "LBP",
		"code": "LBP",
		"symbol_native": "ل.ل.\u200F",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"LKR": {
		"symbol": "LKR",
		"code": "LKR",
		"symbol_native": "රු.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"LRD": {
		"symbol": "LRD",
		"code": "LRD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"LSL": {
		"symbol": "LSL",
		"code": "LSL",
		"symbol_native": "LSL",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"LYD": {
		"symbol": "LYD",
		"code": "LYD",
		"symbol_native": "د.ل.\u200F",
		"decimal_digits": 3,
		"rounding": 0.0
	},
	"MAD": {
		"symbol": "MAD",
		"code": "MAD",
		"symbol_native": "د.م.\u200F",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"MDL": {
		"symbol": "MDL",
		"code": "MDL",
		"symbol_native": "L",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"MGA": {
		"symbol": "MGA",
		"code": "MGA",
		"symbol_native": "Ar",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"MKD": {
		"symbol": "MKD",
		"code": "MKD",
		"symbol_native": "ден",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"MMK": {
		"symbol": "MMK",
		"code": "MMK",
		"symbol_native": "K",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"MNT": {
		"symbol": "MNT",
		"code": "MNT",
		"symbol_native": "\u20AE",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"MOP": {
		"symbol": "MOP",
		"code": "MOP",
		"symbol_native": "MOP$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"MRO": {
		"symbol": "MRO",
		"code": "MRO",
		"symbol_native": "أ.م.\u200F",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"MUR": {
		"symbol": "MUR",
		"code": "MUR",
		"symbol_native": "Rs",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"MWK": {
		"symbol": "MWK",
		"code": "MWK",
		"symbol_native": "MK",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"MXN": {
		"symbol": "MX$",
		"code": "MXN",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"MXV": {
		"symbol": "MXV",
		"code": "MXV",
		"symbol_native": "MXV",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"MYR": {
		"symbol": "MYR",
		"code": "MYR",
		"symbol_native": "RM",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"MZN": {
		"symbol": "MZN",
		"code": "MZN",
		"symbol_native": "MTn",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"NAD": {
		"symbol": "NAD",
		"code": "NAD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"NGN": {
		"symbol": "NGN",
		"code": "NGN",
		"symbol_native": "\u20A6",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"NIO": {
		"symbol": "NIO",
		"code": "NIO",
		"symbol_native": "C$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"NOK": {
		"symbol": "NOK",
		"code": "NOK",
		"symbol_native": "kr",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"NPR": {
		"symbol": "NPR",
		"code": "NPR",
		"symbol_native": "नेरू",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"NZD": {
		"symbol": "NZ$",
		"code": "NZD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"OMR": {
		"symbol": "OMR",
		"code": "OMR",
		"symbol_native": "ر.ع.\u200F",
		"decimal_digits": 3,
		"rounding": 0.0
	},
	"PAB": {
		"symbol": "PAB",
		"code": "PAB",
		"symbol_native": "B.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"PEN": {
		"symbol": "PEN",
		"code": "PEN",
		"symbol_native": "S",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"PGK": {
		"symbol": "PGK",
		"code": "PGK",
		"symbol_native": "K",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"PHP": {
		"symbol": "PHP",
		"code": "PHP",
		"symbol_native": "\u20B1",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"PKR": {
		"symbol": "PKR",
		"code": "PKR",
		"symbol_native": "Rs",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"PLN": {
		"symbol": "PLN",
		"code": "PLN",
		"symbol_native": "zł",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"PYG": {
		"symbol": "PYG",
		"code": "PYG",
		"symbol_native": "Gs.",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"QAR": {
		"symbol": "QAR",
		"code": "QAR",
		"symbol_native": "ر.ق.\u200F",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"RON": {
		"symbol": "RON",
		"code": "RON",
		"symbol_native": "RON",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"RSD": {
		"symbol": "RSD",
		"code": "RSD",
		"symbol_native": "RSD",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"RUB": {
		"symbol": "RUB",
		"code": "RUB",
		"symbol_native": "\u20BD",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"RWF": {
		"symbol": "RWF",
		"code": "RWF",
		"symbol_native": "RF",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"SAR": {
		"symbol": "SAR",
		"code": "SAR",
		"symbol_native": "ر.س.\u200F",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SBD": {
		"symbol": "SBD",
		"code": "SBD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SCR": {
		"symbol": "SCR",
		"code": "SCR",
		"symbol_native": "SR",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SDG": {
		"symbol": "SDG",
		"code": "SDG",
		"symbol_native": "ج.س.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SEK": {
		"symbol": "SEK",
		"code": "SEK",
		"symbol_native": "kr",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SGD": {
		"symbol": "SGD",
		"code": "SGD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SHP": {
		"symbol": "SHP",
		"code": "SHP",
		"symbol_native": "£",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SLL": {
		"symbol": "SLL",
		"code": "SLL",
		"symbol_native": "Le",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"SOS": {
		"symbol": "SOS",
		"code": "SOS",
		"symbol_native": "S",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"SRD": {
		"symbol": "SRD",
		"code": "SRD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SSP": {
		"symbol": "SSP",
		"code": "SSP",
		"symbol_native": "£",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"STN": {
		"symbol": "STN",
		"code": "STN",
		"symbol_native": "STN",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"SYP": {
		"symbol": "SYP",
		"code": "SYP",
		"symbol_native": "ل.س.\u200F",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"SZL": {
		"symbol": "SZL",
		"code": "SZL",
		"symbol_native": "E",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"THB": {
		"symbol": "THB",
		"code": "THB",
		"symbol_native": "THB",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"TJS": {
		"symbol": "TJS",
		"code": "TJS",
		"symbol_native": "сом.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"TND": {
		"symbol": "TND",
		"code": "TND",
		"symbol_native": "د.ت.\u200F",
		"decimal_digits": 3,
		"rounding": 0.0
	},
	"TOP": {
		"symbol": "TOP",
		"code": "TOP",
		"symbol_native": "T$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"TRY": {
		"symbol": "TRY",
		"code": "TRY",
		"symbol_native": "\u20BA",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"TTD": {
		"symbol": "TTD",
		"code": "TTD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"TWD": {
		"symbol": "NT$",
		"code": "TWD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"TZS": {
		"symbol": "TZS",
		"code": "TZS",
		"symbol_native": "TSh",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"UAH": {
		"symbol": "UAH",
		"code": "UAH",
		"symbol_native": "\u20B4",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"UGX": {
		"symbol": "UGX",
		"code": "UGX",
		"symbol_native": "USh",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"USD": {
		"symbol": "$",
		"code": "USD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"USN": {
		"symbol": "USN",
		"code": "USN",
		"symbol_native": "USN",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"UYI": {
		"symbol": "UYI",
		"code": "UYI",
		"symbol_native": "UYI",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"UYU": {
		"symbol": "UYU",
		"code": "UYU",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"UZS": {
		"symbol": "UZS",
		"code": "UZS",
		"symbol_native": "сўм",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"VEF": {
		"symbol": "VEF",
		"code": "VEF",
		"symbol_native": "Bs.",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"VND": {
		"symbol": "\u20AB",
		"code": "VND",
		"symbol_native": "\u20AB",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"VUV": {
		"symbol": "VUV",
		"code": "VUV",
		"symbol_native": "VT",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"WST": {
		"symbol": "WST",
		"code": "WST",
		"symbol_native": "WS$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"XAF": {
		"symbol": "FCFA",
		"code": "XAF",
		"symbol_native": "FCFA",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"XCD": {
		"symbol": "EC$",
		"code": "XCD",
		"symbol_native": "$",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"XOF": {
		"symbol": "CFA",
		"code": "XOF",
		"symbol_native": "CFA",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"XPF": {
		"symbol": "CFPF",
		"code": "XPF",
		"symbol_native": "FCFP",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"YER": {
		"symbol": "YER",
		"code": "YER",
		"symbol_native": "ر.ي.\u200F",
		"decimal_digits": 0,
		"rounding": 0.0
	},
	"ZAR": {
		"symbol": "ZAR",
		"code": "ZAR",
		"symbol_native": "R",
		"decimal_digits": 2,
		"rounding": 0.0
	},
	"ZMW": {
		"symbol": "ZMW",
		"code": "ZMW",
		"symbol_native": "K",
		"decimal_digits": 2,
		"rounding": 0.0
	}
}

const getCurrencySymbol = (currencyCode) => {
	return currencyCodeMap[currencyCode]?.symbol || currencyCode
}

export const CarouselCheckboxContainer = ({ upsell, loadingUpsellProductImage, upsellProductImage, upsellProductPrice, upsellProductCompareAtPrice, shopCurrency }) => {
	const [checked, setChecked] = useState(true)
	const { id } = useParams()

	const generatePrettyCheckboxClasses = (styling) => {
		const classes = ["pretty"]
		
		switch (styling.checkboxType) {
			case "box":
				if (styling.checkmarkIcon !== "default") {
					classes.push("p-icon")
				} else {
					classes.push("p-default")
				}
				break
			case "switchOutline":
				classes.push("p-switch")
				break
			case "switchFill":
				classes.push("p-switch")
				classes.push("p-fill")
				break
			case "switchSlim":
				classes.push("p-switch")
				classes.push("p-slim")
				break
			default:
				break
		}

		switch (styling.borderType) {
			case "squared":
				break
			case "curved":
				classes.push("p-curve")
				break
			case "round":
				classes.push("p-round")
				break
			default:
				break
		}

		switch (styling.checkmarkType) {
			case "default":
				break
			case "fill":
				classes.push("p-fill")
				break
			case "thick":
				classes.push("p-thick")
				break
			default:
				break
		}

		return classes.join(" ")
	}

	const generatePrettyCheckmarkColor = (styling) => {
		if (styling.colorType === "preset") {
			return "state p-" + styling.presetColor
		} else {
			return "state custom-color"
		}
	}

	return (
		<div id={id ? `justUpsell-${id}` : ""} className={`upsell-checkbox-container ${upsell.styling.showImage ? "upsell-showImage" : ""} ${upsell.styling.showCompareAtPrice ? "upsell-showCompareAtPrice" : ""}`}>
			<div className={generatePrettyCheckboxClasses(upsell.styling)}>
				<input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />

				<div className={`upsell-checkmark-container ${generatePrettyCheckmarkColor(upsell.styling)}`} style={{
					...(upsell.styling.colorType === "custom" && { "--custom-checkbox-color": upsell.styling.customCheckboxColor }),
					...(upsell.styling.colorType === "custom" && { "--custom-checkmark-color": upsell.styling.customCheckmarkColor })
				}}>
					{
						upsell.styling.checkmarkIcon !== "default" && <i className={`icon mdi mdi-${upsell.styling.checkmarkIcon}`}/>
					}

					<label className="upsell-label">{upsell.displayText || "."}</label>

					<div className="upsell-price-container">
						{
							upsellProductPrice && <span className="upsell-price">{getCurrencySymbol(shopCurrency)}{upsellProductPrice}</span>
						}
	
						{
							upsell.styling.showCompareAtPrice && upsellProductCompareAtPrice && <span className="upsell-compareAtPrice">{getCurrencySymbol(shopCurrency)}{upsellProductCompareAtPrice}</span>
						}
					</div>
				</div>
			</div>

			{
				upsell.seeMoreEnabled ?
					<span className="upsell-seeMore-button" style={{
						...(upsell.styling.colorType === "custom" && { "--custom-checkbox-color": upsell.styling.customCheckboxColor }),
						...(upsell.styling.colorType === "custom" && { "--custom-checkmark-color": upsell.styling.customCheckmarkColor })
					}}>
						See more
					</span>
				: ""
			}

			{
				upsell.styling.showImage ?
					loadingUpsellProductImage ?
						<div>
							<SkeletonThumbnail size="small"/>
						</div>
					: upsellProductImage ?
						<img className="upsell-checkbox-image neu-shadow" src={upsellProductImage}/>
					: ""
				: ""
			}
		</div>
	)
}