import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Localized } from '@fluent/react';

import cvTranslatedLocales from '../../../../locales/translated.json';
import { resetSkippedSentences } from '../../actions/sentences';
import { DEFAULT_LOCALE } from '../../l10n';
import type { RootState } from '../../types';

import Error from '../error';
import LanguageSelector from '../language-selector';

const CV_TRANSLATED_LOCALES: string[] = cvTranslatedLocales;

export default function Settings() {
  const { allLanguages = [], currentUILocale } = useSelector((state: RootState) => state.languages);
  const { skippedSentences } = useSelector((state: RootState) => state.sentences);
  const { showErrorMessage } = useSelector((state: RootState) => state.settings);
  const [showTranslatedWarning, setShowTranslatedWarning] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const resetSkipped = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(resetSkippedSentences());
  };

  const onLanguageSelect = (locale: string) => {
    history.push(`/${locale}/profile`);
  };

  useEffect(() => {
    const possiblyUntranslated =
      currentUILocale !== DEFAULT_LOCALE && !CV_TRANSLATED_LOCALES.includes(currentUILocale);
    setShowTranslatedWarning(possiblyUntranslated);
  }, [currentUILocale]);

  return (
    <section>
      <Localized id="sc-settings-title">
        <h2></h2>
      </Localized>

      {showErrorMessage && <Error translationKey="sc-settings-failed" />}

      <section>
        <section className="settings-section">
          <Localized id="sc-settings-ui-language">
            <h3></h3>
          </Localized>
          <LanguageSelector
            selected={currentUILocale}
            languages={allLanguages}
            onChange={onLanguageSelect}
          />
          {showTranslatedWarning && (
            <Localized
              id="sc-settings-language-translated-warning"
              elems={{
                pontoonLinkLink: (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://pontoon.mozilla.org/${currentUILocale}/common-voice/`}
                  />
                ),
              }}
            >
              <div className="warning box"></div>
            </Localized>
          )}
        </section>

        {skippedSentences && skippedSentences.length > 0 && (
          <section className="settings-section">
            <Localized id="sc-settings-reset-skipped">
              <h3></h3>
            </Localized>
            <Localized id="sc-settings-skipped-decription">
              <p></p>
            </Localized>
            <button className="standalone" onClick={resetSkipped}>
              <Localized id="sc-settings-show-all-button" />
            </button>
          </section>
        )}
      </section>
    </section>
  );
}
