function getBaseName(pathname) {
  let release = '/';
  const pathName = pathname.split('/');

  pathName.shift();

  if (pathName[0] === 'beta') {
    pathName.shift();
    release = `/beta/`;
  }

  return `${release}`;
}

function resolveRelPath(path) {
  return `/insights/image-builder/${path}`;
}

export { getBaseName, resolveRelPath };
