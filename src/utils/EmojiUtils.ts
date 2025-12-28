
import * as emoji from "emoji-dictionary";
import emojiRegex from "emoji-regex";

export class EmojiUtils {
	// Encode emoji unicode thành :shortcode:
	static encode(text: string): string {
		const regex = emojiRegex();
		return text.replace(regex, (m) => {
			const name = emoji.getName(m);
			return name ? `:${name}:` : m;
		});
	}

	// Decode :shortcode: về emoji unicode
	static decode(text: string): string {
		return text.replace(/:([a-zA-Z0-9_+-]+):/g, (m, name) => {
			const unicode = emoji.getUnicode(name);
			return unicode || m;
		});
	}
}
