import { WebR } from '@r-wasm/webr'

// this can be accessed everywhere as "webR"
globalThis.webR = new WebR();
await globalThis.webR.init();

export const webR = globalThis.webR;

/**
 * This is a [Tag Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
 * 
 * @param {strings[]} strings 
 * @param  {...any} values 
 * @returns a WebR toJs() object
 * @example
 * await R`sample(100, 5)`
 */
globalThis.R = async function R(strings, ...values) {

	const [ options ] = values;

	let result = "";
	for (let i = 0; i < strings.length; i++) {
		result += strings[ i ];
	}
	
	let res, tmp;
	if (options === undefined) {
		tmp = await webR.evalR(result)
		if (typeof tmp == "function") return tmp
	} else {
		tmp = await webR.evalR(result, options)
	}
	res = simplifyRJs(await tmp.toJs())

	let ret = res

	return Promise.resolve(ret)

}

export function simplifyRJs(obj) {
	// if the result is a single char/dbl/bool/int then return a plain value
	// if it's an unnamed vector then return a typed array
	// if function, return w/o running toJs()
	let ret = obj;
	if ([ 'character', 'double', 'logical', 'integer' ].includes(obj.type)) {
		if (obj.names === null) {
			if (obj.values.length <= 1) {
				ret = obj.values[ 0 ]
			} else {
				ret = obj.values
			}
		}
	}
	return ret
}

export const R = globalThis.R

// R major/minor version as string
export const rVersion = await globalThis.webR.evalRString(`paste0(unclass(getRversion())[[1]][1:2], collapse=".")`)

/**
 * Install one or more R packages from R universe
 * 
 * Inspired by timelyportfolio
 * 
 * @note IT IS ON YOU FOR NOW TO ENSURE NO PACKAGES IN THE 
 *       DEPENDENCY TREE REQUIRE COMPILATION
 * @param {string[] | string} pkgs string or string array of R pkg names
 * @example
 * await R.installRUniversePackages("basetheme")
 * R.library("basetheme")
 */
export async function installRUniversePackages(pkgs) {

	if (typeof pkgs === 'string') {
		pkgs = [ pkgs ]
	}

	for (const pkg of pkgs) {
		const pkgMeta = await rUniversePkgInfo(pkg, rVersion)
		if (pkgMeta.compiled) {
			console.warn(`'${pkg}' cannot be installed because it reqires compilation`)
		} else {
			installRUniversePackageFromURL(pkg, pkgMeta.rUniverseDownloadURL)
		}
	}

}

/**
 * Install a built package from an R Universe URL
 * 
 * Inspired by timelyportfolio
 * 
 * @param {string} pkg package name
 * @param {string} rUniverseURL full r-univ URL
 */
function installRUniversePackageFromURL(pkg, rUniverseURL) {

	globalThis.webR.evalR(`
tmp <- tempfile()
message(paste("Installing webR package: ${pkg} from ${rUniverseURL}"));
utils::download.file("${rUniverseURL}", tmp, quiet = FALSE);
utils::untar(tmp, exdir = .libPaths()[[1]], tar = "internal", extras = "--no-same-permissions");
`)

}

/**
 * Get R pkg author, compilation req, and version from r-universe
 * @param {string} rPackage 
 * @returns {object} with `compiled`, `rUniverseDownloadURL`
 */
export async function rUniversePkgInfo(rPackage, rVersion = "4.1") {

	const rPkgs = await readJSON(`https://r-universe.dev/stats/powersearch?limit=1&all=true&q=${rPackage}`)

	const rPkgAuthor = rPkgs.results[ 0 ].maintainer.login;

	const rPkgDetails = await readJSON(`https://${rPkgAuthor}.r-universe.dev/${rPackage}/json`)

	const rPkgVersion = rPkgDetails.binaries
		.filter((d) => (d.os == "mac") & d.r.startsWith(rVersion))
		.pop(1).version;

	const pkgDownloadInfo = {
		compiled: rPkgDetails.NeedsCompilation !== "no",
		rUniverseDownloadURL: `https://${rPkgAuthor}.r-universe.dev/bin/macosx/contrib/${rVersion}/${rPackage}_${rPkgVersion}.tgz`
	}

	return pkgDownloadInfo

}