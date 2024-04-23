import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('cn-pill')
export class CnPill extends LitElement {
  // The text to display in the pill
  @property({ type: String })
  label = ''

  // If set, the pill will show a prepended icon with the given noun
  @property({ type: String })
  noun = ''

  // Standard disabled attribute
  @property({ type: Boolean, reflect: true })
  disabled = false

  // If set, the pill will show a append icon with the given noun
  @property({ type: String })
  action = ''

  render() {
    return html`
            ${
              this.noun
                ? html`<cn-icon class="prepend" noun="${this.noun}" xsmall></cn-icon>`
                : ''
            }
            <span class="caption">${this.label}</span>
            ${
              this.action
                ? html`<cn-icon class="action" noun="${this.action}" xsmall></cn-icon>`
                : ''
            }    
        `
  }

  static styles = css`
        :host {
            position: relative;
            display: inline-block;
            background: var(--background-button);
            vertical-align: middle;
            height: calc(var(--cn-grid) * 4);
            color: var(--color-on-button);
            text-decoration: none;
            font-size: var(--font-size-caption);
            line-height: calc(var(--cn-grid) * 4);
            padding: 0 calc(var(--cn-grid) * 1.5);
            border-radius: calc(var(--cn-grid) * 1);
            user-select: none;
            cursor: pointer;
        }
        :host cn-icon.prepend {
          vertical-align: middle;
          padding-right: var(--cn-grid);
          margin: 0;
          margin-left: calc(-0.5 * var(--cn-grid));
        }
        :host cn-icon.action {
          vertical-align: middle;
          padding-right: var(--cn-grid);
          margin: 0;
          margin-right: calc(-0.5 * var(--cn-grid));
        }
    `
}
