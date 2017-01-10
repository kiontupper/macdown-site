function mathInline(state, silent) {
	var pos = state.pos;
	var start = pos;
	var max = state.posMax;
	var starter, ender;

	if (pos + 6 > max) {
		return false;
	}

	starter = state.src.slice(pos, pos + 3);
	if (starter === '\\\\(') {
		ender = '\\\\)';
	} else {
		return false;
	}

	if (silent) {
		return false;
	}

	for (pos; pos + ender.length <= max; pos++) {
		if (state.src.slice(pos, pos + ender.length) === ender) {
			state.push({
				type: 'math_inline',
				content: state.src.slice(start + starter.length, pos),
				level: state.level
			});
			state.pos = pos + ender.length;
			return true;
		}
	}

	return false;
}

rmkb.inline.ruler.before('escape', 'math_inline', mathInline);

rmkb.renderer.rules.math_inline = function (tokens, idx, options, env) {
	return '<span class="katex-rendered">' +
			katex.renderToString(tokens[idx].content, false, false) +
			'</span>';
}