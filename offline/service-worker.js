import toolbox from 'sw-toolbox';
import {resources, version} from './resources';

toolbox.options = {
	cache: {
		name: `busboy-v${version}`
	}
}

toolbox.precache(resources);
resources.forEach(
	resource => toolbox.router.get(resource, toolbox.fastest)
);
