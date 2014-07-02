/**
 * editables.js is part of Aloha Editor project http://aloha-editor.org
 *
 * Aloha Editor is a WYSIWYG HTML5 inline editing library and editor.
 * Copyright (c) 2010-2014 Gentics Software GmbH, Vienna, Austria.
 * Contributors http://aloha-editor.org/contribution.php
 */
define([
	'dom',
	'undo',
	'boundaries'
], function (
	Dom,
	Undo,
	Boundaries
) {
	'use strict';

	function fromElem(editor, elem) {
		return editor.editables[Dom.ensureExpandoId(elem)];
	}

	function fromBoundary(editor, boundary) {
		var container = Boundaries.container(boundary);
		var elem = Dom.upWhile(container, function (node) {
			return !editor.editables[Dom.ensureExpandoId(node)];
		});
		return elem && fromElem(editor, elem);
	}

	function Editable(elem) {
		var undoContext = Undo.Context(elem);
		var id = Dom.ensureExpandoId(elem);
		var editable = {
			'id': id,
			'elem': elem,
			'undoContext': undoContext
		};
		return editable;
	}

	function dissocFromEditor(editor, editable) {
		delete editor.editables[editable.id];
	}

	function assocIntoEditor(editor, editable) {
		editor.editables[editable.id] = editable;
	}

	function close(editable) {
		Undo.close(editable['undoContext']);
	}

	/**
	 * Associates an editable to the given AlohaEvent.
	 *
	 * @param  {AlohaEvent} alohaEvent
	 * @return {AlohaEvent}
	 */
	function handle(alohaEvent) {
		if ('mousemove' === alohaEvent.type) {
			return alohaEvent;
		}
		if (!alohaEvent.range) {
			return alohaEvent;
		}
		var host = Dom.editingHost(alohaEvent.range.commonAncestorContainer);
		if (!host) {
			return alohaEvent;
		}
		alohaEvent.editable = fromElem(alohaEvent.editor, host);
		return alohaEvent;
	}

	return {
		Editable         : Editable,
		fromElem         : fromElem,
		fromBoundary     : fromBoundary,
		assocIntoEditor  : assocIntoEditor,
		dissocFromEditor : dissocFromEditor,
		close            : close,
		handle           : handle
	};
});
