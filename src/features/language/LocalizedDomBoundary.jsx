import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const TRANSLATABLE_ATTRIBUTES = ["aria-label", "placeholder", "title"];
const IGNORED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);

const preserveWhitespace = (source, translated) => {
  const leading = source.match(/^\s*/)?.[0] || "";
  const trailing = source.match(/\s*$/)?.[0] || "";
  return `${leading}${translated}${trailing}`;
};

export default function LocalizedDomBoundary({
  language = "en",
  translateText = (value) => value,
  children,
}) {
  const rootRef = useRef(null);
  const textSourcesRef = useRef(new WeakMap());
  const attributeSourcesRef = useRef(new WeakMap());

  const applyTranslations = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const translateValue = (value) => {
      const exact = translateText(value);
      if (exact !== value) return exact;

      const percentage = value.match(/^(\d+%)\s+(.+)$/);
      if (!percentage) return value;
      const translatedSuffix = translateText(percentage[2]);
      return translatedSuffix === percentage[2]
        ? value
        : `${percentage[1]} ${translatedSuffix}`;
    };

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const parent = node.parentElement;
      if (parent && !IGNORED_TAGS.has(parent.tagName) && !parent.closest('[data-no-translate="true"]')) {
        const current = node.nodeValue || "";
        const savedSource = textSourcesRef.current.get(node);
        let source = savedSource ?? current;

        if (language === "en") {
          if (savedSource !== undefined && current !== source) {
            node.nodeValue = source;
          } else if (savedSource === undefined) {
            source = current;
          }
          textSourcesRef.current.set(node, source);
        } else {
          const translatedSource = translateValue(source.trim());
          const translatedCurrent = translateValue(current.trim());
          const renderedSource = translatedSource === source.trim()
            ? source
            : preserveWhitespace(source, translatedSource);

          if (current !== source && current !== renderedSource && translatedCurrent !== current.trim()) {
            source = current;
            textSourcesRef.current.set(node, source);
          } else if (!textSourcesRef.current.has(node)) {
            textSourcesRef.current.set(node, source);
          }

          const translated = translateValue(source.trim());
          if (source.trim() && translated !== source.trim()) {
            const nextValue = preserveWhitespace(source, translated);
            if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
          }
        }
      }
      node = walker.nextNode();
    }

    root.querySelectorAll("[aria-label], [placeholder], [title]").forEach((element) => {
      if (element.closest('[data-no-translate="true"]')) return;
      const savedSources = attributeSourcesRef.current.get(element) || {};

      TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const current = element.getAttribute(attribute) || "";
        const hasSavedSource = Object.prototype.hasOwnProperty.call(savedSources, attribute);
        let source = hasSavedSource ? savedSources[attribute] : current;

        if (language === "en") {
          if (hasSavedSource && current !== source) {
            element.setAttribute(attribute, source);
          } else if (!hasSavedSource) {
            source = current;
          }
          savedSources[attribute] = source;
          return;
        }

        const renderedSource = translateValue(source);
        const translatedCurrent = translateValue(current);
        if (current !== source && current !== renderedSource && translatedCurrent !== current) {
          source = current;
          savedSources[attribute] = source;
        } else if (!savedSources[attribute]) {
          savedSources[attribute] = source;
        }

        const translated = translateValue(source);
        if (translated !== source && current !== translated) {
          element.setAttribute(attribute, translated);
        }
      });

      attributeSourcesRef.current.set(element, savedSources);
    });

    root.dataset.language = language;
  }, [language, translateText]);

  useLayoutEffect(() => {
    applyTranslations();
  }, [applyTranslations]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || language === "en") return undefined;

    let frameId = null;
    const observer = new MutationObserver(() => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        applyTranslations();
      });
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRIBUTES,
    });

    return () => {
      observer.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [applyTranslations, language]);

  return (
    <div ref={rootRef} className="contents" lang={language}>
      {children}
    </div>
  );
}
