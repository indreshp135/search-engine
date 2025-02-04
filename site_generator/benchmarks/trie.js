const siteData = require("../site_data.json");

class TrieNode {
	constructor(char) {
		this.children = [];
		for (var i = 0; i < 26; i++) {
			this.children[i] = null;
		}
		this.isEndWord = false;
		this.char = char;
		this.url = [];
	}
	markAsLeaf(url) {
		this.isEndWord = true;
		this.url.push(url);
	}
	unMarkAsLeaf() {
		this.isEndWord = false;
	}
}

class Trie {
	constructor() {
		this.root = new TrieNode("");
	}

	getIndex(t) {
		return t.charCodeAt(0) - "a".charCodeAt(0);
	}
	insert(key, url) {
		if (!/^[a-zA-Z]+$/.test(key)) return;
		if (key == null) {
			return;
		}
		key = key.toLowerCase();
		let currentNode = this.root;
		let index = 0;
		for (let level = 0; level < key.length; level++) {
			index = this.getIndex(key[level]);

			if (currentNode.children[index] == null) {
				currentNode.children[index] = new TrieNode(key[level]);
			}
			currentNode = currentNode.children[index];
		}
		currentNode.markAsLeaf(url);
	}
	search(key) {
		if (key == null) {
			return [];
		}
		key = key.toLowerCase();
		let currentNode = this.root;
		let index = 0;

		for (var level = 0; level < key.length; level++) {
			index = this.getIndex(key[level]);
			if (currentNode.children[index] == null) {
				return [];
			}
			currentNode = currentNode.children[index];
		}
		if (currentNode != null && currentNode.isEndWord) {
			return currentNode.url;
		}
		return [];
	}
	suggest(key) {
		if (key == null) {
			return;
		}
		if (!/^[a-zA-Z]+$/.test(key)) return [];
		key = key.toLowerCase();
		let currentNode = this.root;
		let found = true;
		let index = 0;

		for (let level = 0; level < key.length; level++) {
			index = this.getIndex(key[level]);

			if (currentNode.children[index] == null) {
				found = false;
				break;
			}
			currentNode = currentNode.children[index];
		}

		if (!found) {
			return [];
		}
		const suggestions = [];
		let tracker = "";

		function recurse(node) {
			if (node) {
				tracker += node.char;

				if (node.isEndWord) {
					let temp = key + tracker;
					suggestions.push(temp);
				}

				node.children.forEach((child) => recurse(child));
				tracker = tracker.slice(0, -1);
			}
		}

		currentNode.children.forEach((child) => recurse(child));
		if (currentNode.isEndWord) suggestions.push(key);
		return suggestions.sort();
	}
}

trieHead = new Trie();
triePtag = new Trie();

t1 = Date.now();
siteData.forEach((site) => {
	data = site.title.split(/[^A-Za-z]/);
	Object.values(data).forEach((datum) => {
		trieHead.insert(datum, site.site_url);
	});
	data = site.body.split(/[^A-Za-z]/);
	Object.values(data).forEach((datum) => {
		triePtag.insert(datum, site.site_url);
	});
});
t2 = Date.now();
console.log(t2 - t1);
