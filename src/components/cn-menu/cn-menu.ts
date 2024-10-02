import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './light-dom.css'
import { logDebug } from '../../utils/logHelpers'

@customElement('cn-menu')
export class CnMenu extends LitElement {
  static styles = css`
    .cn-menu {
      position: relative;
      display: inline-block;
    }
    /* Target the button directly */
    .cn-menu button { 
      border: none;
      cursor: pointer;
      color: var(--color-on-primary);
      background: var(--background-button-text);
      border-radius: 50%;
      width: calc(6 * var(--cn-grid));
      height: calc(6 * var(--cn-grid));
      padding: 0;
      margin: 0;
      display: flex;
        justify-content: center;
        align-items: center;
    }
    .cn-menu button:hover {
        background: var(--background-button-text-hover);
        box-shadow: var(--shadow-button-hover);
        color: var(---cn-color-on-button-hover);
    }
    .cn-menu button:active {
        background: var(--background-button-text-active);
        color: var(---cn-color-on-button-active);
    }

    .cn-menu-content {
      display: none;
      position: absolute;
      background-color: var(--background-elevation-2);
      min-width: 160px;
      box-shadow: var(--shadow-elevation-2);
      z-index: 1;
      top: calc(2 * var(--cn-grid));
      // right: calc(2 * var(--cn-grid));
      padding: 0;
      border-radius: var(--cn-border-radius);
      overflow: hidden;
    }
    .show {
      display: block;
    }
  `
  @property({ type: String, reflect: true, attribute: 'aria-expanded' })
  expanded = 'false' // Set initial value to 'false'

  render() {
    const menuPosition = this._getMenuPosition()

    return html`
      <div class="cn-menu" role="menu"> 
        <button 
          type="button" 
          class="text icon" 
          aria-haspopup="true" 
          aria-expanded="${this.expanded ? 'true' : 'false'}" 
          @click="${this._toggleMenu}"
        >
          <cn-icon small noun="kebab"></cn-icon>
        </button>
        <div class="cn-menu-content ${this.expanded === 'true' ? 'show' : ''}" role="menuitem"
          style="${menuPosition === 'left' ? 'right: var(--cn-grid);' : 'left: var(--cn-grid);'}"
        > 
          <slot></slot>
        </div>
      </div>
    `
  }

  private _getMenuPosition(): string {
    const buttonRect = this.shadowRoot
      ?.querySelector('button')
      ?.getBoundingClientRect()
    const viewportWidth = window.innerWidth

    if (buttonRect) {
      const buttonMidpoint = buttonRect.left + buttonRect.width / 2
      if (buttonMidpoint < viewportWidth / 2) {
        return 'right' // Open to the right if the button is on the left side
      }
      return 'left' // Open to the left if the button is on the right side
    }

    return 'right' // Default to right if the button rect cannot be determined
  }

  private _toggleMenu(e: Event) {
    e.stopPropagation() // Prevent the click event from bubbling up
    const expanded = this.expanded === 'true' ? 'false' : 'true' // Toggle between 'true' and 'false'
    this.expanded = expanded
    logDebug('dispatching menu-toggled', expanded)
    this.dispatchEvent(
      new CustomEvent('menu-toggled', {
        detail: { expanded },
        bubbles: true,
        composed: true,
      }),
    )
  }

  // Handle clicks outside the menu
  private _handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    // Check if the click target is within the menu content
    const isClickInsideMenu = this.shadowRoot
      ?.querySelector('.cn-menu-content')
      ?.contains(target)
    if (
      this.expanded === 'true' &&
      !this.contains(target) &&
      !isClickInsideMenu &&
      !(this === target)
    ) {
      logDebug('CnMenu', '_handleDocumentClick', this.expanded)
      this._toggleMenu(event)
    }
  }

  // Add event listeners in connectedCallback
  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('click', this._handleDocumentClick.bind(this))
  }

  // Remove event listener in disconnectedCallback
  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._handleDocumentClick.bind(this))
  }
}
