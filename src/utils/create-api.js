import Vue from 'vue'
import CreateAPI from 'vue-create-api'
import Toast from '../components/common/Toast'
import Popup from '../components/common/Popup'
import GroupDialog from '../components/shelf/ShelfGroupDialog'

Vue.use(CreateAPI)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)

Vue.mixin({
  methods: {
    toast(settings) {
      return this.$createToast({
        $props: settings
      })
    },
    simpleToast(text) {
      const toast = this.$createToast({
        $props: {
          text: text
        }
      })
      toast.show()
      toast.updateText(text)
    },
    popup(settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    dialog(settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  }
})
