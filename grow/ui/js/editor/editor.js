/**
 * Content editor.
 */

import Document from './document'
import EditorApi from './editorApi'


export default class Editor {
  constructor(containerEl) {
    this.containerEl = containerEl
    this.mobileToggleEl = this.containerEl.querySelector('#content_device')
    this.contentPreviewEl = this.containerEl.querySelector('.content__preview')
    this.previewEl = this.containerEl.querySelector('.preview')
    this.fieldsEl = this.containerEl.querySelector('.fields')
    this.saveEl = this.containerEl.querySelector('.sidebar__save button')
    this.podPathEl = this.containerEl.querySelector('#pod_path')
    this.host = this.previewEl.dataset.host
    this.port = this.previewEl.dataset.port
    this.fields = []
    this.document = null

    this.mobileToggleEl.addEventListener('click', this.handleMobileClick.bind(this))
    this.saveEl.addEventListener('click', this.handleSaveClick.bind(this))

    this.api = new EditorApi({
      host: this.host,
      port: this.port,
    })
    this.loadDetails(this.podPath)
  }

  get podPath() {
    return this.podPathEl.value
  }

  get previewUrl() {
    return `http://${this.host}:${this.port}${this.servingPath}`
  }

  get servingPath() {
    if (!this.document) {
      return ''
    }
    return this.document.servingPath
  }

  addField(field) {
    this.fields.push(field)
    this.fieldsEl.appendChild(field.fieldEl)
  }

  clearFields() {
    this.fields = []
    while (this.fieldsEl.firstChild) {
      this.fieldsEl.removeChild(this.fieldsEl.firstChild)
    }
  }

  handleMobileClick() {
    if (this.mobileToggleEl.checked) {
      this.contentPreviewEl.classList.add('content__preview--mobile')
      this.previewEl.classList.add('mdl-shadow--6dp')
    } else {
      this.contentPreviewEl.classList.remove('content__preview--mobile')
      this.previewEl.classList.remove('mdl-shadow--6dp')
    }
  }

  handleGetDocumentResponse(response) {
    this.document = new Document(
      response['pod_path'],
      response['fields'],
      response['front_matter'],
      response['serving_paths'],
      response['default_locale'])

    this.clearFields()

    for (const field of this.document.fields) {
      this.addField(field)
    }

    this.previewEl.src = this.previewUrl
  }

  handleSaveDocumentResponse(response) {
    this.document.update(
      response['pod_path'],
      response['front_matter'],
      response['serving_paths'],
      response['default_locale'])

    this.previewEl.src = this.previewUrl
  }

  handleSaveClick(response) {
    const frontMatter = {}
    for (const field of this.fields) {
      // Field key getter not working...?!?
      frontMatter[field._key] = field.value
    }
    const result = this.api.saveDocument(this.podPath, frontMatter, this.document.locale)
    result.then(this.handleSaveDocumentResponse.bind(this))
  }

  loadDetails(podPath) {
    this.api.getDocument(podPath).then(this.handleGetDocumentResponse.bind(this))
  }
}
