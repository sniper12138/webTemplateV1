<template>
  <div class="create-Home">
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
          active-name="1"
          style="display: flex"
        >
          <MenuItem name="1">
            <Icon type="ios-browsers-outline" />页面模板生成
          </MenuItem>
          <MenuItem name="2" style="margin-left: auto">
            <Button type="primary" @click="createPageModalShow = true"
              >生成</Button
            >
          </MenuItem>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{ background: '#fff' }">
          <Menu
            active-name="1-2"
            theme="light"
            width="auto"
            :open-names="['1']"
          >
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>整体布局
              </template>
              <div id="templateItem1">
                <div
                  class="templateItem"
                  v-for="(item, index) in containerIitem"
                  :key="index"
                  data-item="containerIitem"
                >
                  <p>{{ item.name }}</p>
                  <Input v-model="item.col" />
                </div>
              </div>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>基本样式
              </template>
              <div id="templateItem2">
                <div
                  class="templateItem"
                  v-for="(item, index) in templateItem"
                  :key="index"
                  data-item="templateItem"
                >
                  <p style="width: 100px">{{ item.name }}</p>
                  <template v-if="item.tag == 'img'">
                    <div>
                      <!-- :before-upload="e => handleBeforeUpload(e,'templateItem',index)" -->
                      <upload
                        style="margin-top: 5px"
                        v-if="item.attr.src == ''"
                        ref="upload"
                        name="image"
                        action="http://192.168.10.50:8083/api/upload"
                        :format="['jpg', 'jpeg', 'png']"
                        :on-success="
                          (response) =>
                            handleSuccessUpload(response, 'templateItem', index)
                        "
                      >
                        <Button
                          icon="ios-cloud-upload-outline"
                          style="width: 80px; height: 80px"
                        ></Button>
                      </upload>
                      <div class="uploadImg" v-else>
                        <img :src="item.attr.src" alt="" />
                        <div class="mask">
                          <icon
                            type="ios-trash-outline"
                            style="font-size: 32px; color: #fff"
                            @click.native="
                              handleBeforeDelete('templateItem', index)
                            "
                          ></icon>
                        </div>
                      </div>
                    </div>
                  </template>
                  <Input v-else v-model="item.value" />
                </div>
              </div>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>组件库
              </template>
              <div id="templateItem3">
                <div
                  class="templateItem"
                  v-for="(item, index) in templateViewItem"
                  :key="index"
                  data-item="templateViewItem"
                >
                  <p>{{ item.name }}</p>
                </div>
              </div>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{ padding: '0 24px 24px' }">
          <div
            style="
              margin: 20px 0;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <RadioGroup
              style="flex: 1; text-align: center"
              v-model="changeType"
              type="button"
              @on-change="changeCreateType"
            >
              <Radio label="pc">PC</Radio>
              <Radio label="wap">WAP</Radio>
            </RadioGroup>
            <Button type="primary" @click="showBodyDrawer">修改body样式</Button>
          </div>
          <!-- padding: changeType == 'pc' ? '24px' : '', -->
          <Content
            :style="{
              minHeight: '280px',
              overflow: 'hidden auto',
              width: changeType == 'pc' ? '' : '375px',
              margin: changeType == 'pc' ? '' : '0 auto',
              background:
                bodyStyle.backgroundImage == ''
                  ? bodyStyle.backgroundColor
                  : bodyStyle.backgroundColor +
                    ` url('${bodyStyle.backgroundImage}') no-repeat center top / 100% auto`,
            }"
          >
            <div
              class="create-main main-con"
              id="createItem"
              :class="createItem.length == 0 ? 'flex-center' : ''"
              :style="changeType == 'pc' ? '' : 'font-size: 37.5px;'"
            >
              {{
                createItem.length == 0
                  ? "请拖动左边元素到此区域进行页面设计"
                  : ""
              }}
              <Row
                type="flex"
                v-for="(item, index) in createItem"
                :key="index"
                :data-index="index"
                :data-templateItem="item.item"
              >
                <Col
                  :span="item2.col"
                  v-for="(item2, index2) in item.col"
                  :key="index2"
                  :data-index2="index2"
                  :style="{
                    margin: setStyleVal(item2.attr.margin),
                    padding: setStyleVal(item2.attr.padding),
                    backgroundColor: item2.attr.backgroundColor,
                  }"
                  class="create-main"
                  :id="'col-' + index + '-' + index2"
                >
                  <Button
                    type="primary"
                    size="small"
                    v-if="colEditBtnShow"
                    class="colEditBtn"
                    @click="nodeDomEdit('col', index, index2)"
                    >编辑</Button
                  >
                  <div
                    v-for="(item3, index3) in item2.child"
                    :key="index3"
                    @click="
                      nodeDomEdit('template', index, index2, index3, $event)
                    "
                    :data-templateItem="item3.item"
                  >
                    <template v-if="item3.templateType == 'template'">
                      <div
                        :style="{
                          display:
                            item3.tag == 'img' || item3.tag == 'a'
                              ? 'flex'
                              : '',
                          justifyContent:
                            item3.tag == 'img' || item3.tag == 'a'
                              ? item3.style.textAlign == 'left'
                                ? 'flex-start'
                                : item3.style.textAlign == 'right'
                                ? 'flex-end'
                                : item3.style.textAlign
                              : '',
                        }"
                        v-html="getElement(item3, index, index2, index3)"
                      ></div>
                    </template>
                    <template v-if="item3.templateType == 'templateView'">
                      <div>
                        <swiper
                          :id="'swiper-' + index + '-' + index2 + '-' + index3"
                          class="swiper swiper-container"
                          :style="{
                            width:
                              changeType == 'pc'
                                ? item3.style.width + 'px'
                                : item3.style.width / 75 + 'rem',
                            height:
                              changeType == 'pc'
                                ? item3.style.height + 'px'
                                : item3.style.height / 75 + 'rem',
                          }"
                          :options="{
                            loop: item3.attr.loop,
                            autoplay: item3.attr.autoplay,
                            observer: true,
                            observeParents: true,
                          }"
                          ref="createSwiper"
                          v-if="item3.tag == 'swiper' && swiperViewShow"
                        >
                          <swiper-slide
                            v-for="(listItem, listIndex) in item3.attr.list"
                            :key="'swiper-' + listIndex"
                          >
                            <div class="cover">
                              <img :src="listItem.url" alt="" />
                            </div>
                          </swiper-slide>
                        </swiper>
                        <!-- <template v-if="item3.tag == 'overlay'">
                          <div class="overlay overlayMask" :style="{
                            background: item3.style.backgroundColor
                          }" 
                          :data-overlayId="'overlay-' + index + '-' + index2 + '-' + index3"
                          >
                          <img :src="item3.attr.img.src" :style="getStylesTree(item3.attr.img)" alt="" srcset="" />
                            <div class="closeBtn" :style="getStylesTree(item3.attr.closeBtn)" @click="closeOverlay('overlay-' + index + '-' + index2 + '-' + index3, $event)">{{item3.attr.closeBtn.value}}</div>
                          </div>
                        </template> -->
                      </div>
                    </template>
                  </div>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>

    <Drawer
      title="col-Create"
      v-model="colDrawerShow"
      width="720"
      :mask-closable="false"
    >
      <List>
        <ListItem v-for="(item, index) in createAttrItem" :key="index">
          <div class="list">
            <div class="left">{{ getAttrName(item.name) }}</div>
            <div class="right">
              <template v-if="item.name == 'backgroundColor'">
                <ColorPicker v-model="item.value" alpha />
              </template>
              <template v-else>
                <InputNumber
                  v-for="(item2, index2) in item.value"
                  :key="index2"
                  v-model.number="item.value[index2]"
                />
              </template>
            </div>
          </div>
        </ListItem>
      </List>
      <div class="demo-drawer-footer">
        <Button
          type="primary"
          style="margin-right: 8px"
          icon="ios-trash"
          @click="ColDeleteDom"
          >删除该主框架</Button
        >
        <Button
          type="primary"
          style="margin-right: 8px"
          @click="ColDrawerSubmit"
          >修改</Button
        >
        <Button @click="ColDrawerCancel">取消</Button>
      </div>
    </Drawer>

    <Drawer
      title="template-Create"
      id="template-create-drawer"
      v-model="drawerShow"
      width="720"
      :mask-closable="false"
    >
      <List v-if="templateType == 'template'">
        <h2 v-if="editType != 'img'" style="font-size: 24px; font-weight: bold">
          文本
        </h2>
        <ListItem v-if="editType != 'img'">
          <div class="list">
            <div class="left">文本</div>
            <div class="right">
              <Input type="text" v-model="valueItem" />
            </div>
          </div>
        </ListItem>
        <h2
          v-if="styleItem.length != 0"
          style="font-size: 24px; font-weight: bold"
        >
          样式
        </h2>
        <ListItem v-for="(item, index) in styleItem" :key="'style' + index">
          <div class="list">
            <div class="left">{{ getAttrName(item.type) }}</div>
            <div class="right">
              <RadioGroup
                v-model="item.value"
                type="button"
                v-if="item.type == 'textAlign'"
              >
                <Radio label="left"></Radio>
                <Radio label="center"></Radio>
                <Radio label="right"></Radio>
              </RadioGroup>
              <RadioGroup
                v-model="item.value"
                type="button"
                v-else-if="item.type == 'borderStyle'"
              >
                <Radio label="solid"></Radio>
                <Radio label="dashed"></Radio>
                <Radio label="dotted"></Radio>
              </RadioGroup>
              <ColorPicker
                v-model="item.value"
                alpha
                v-else-if="
                  item.type == 'backgroundColor' ||
                  item.type == 'borderColor' ||
                  item.type == 'color'
                "
              />
              <template v-else-if="item.type == 'backgroundImage'">
                <div>
                  <!-- :before-upload="e => handleBeforeUpload(e,'templateItem',index)" -->
                  <upload
                    style="margin-top: 5px"
                    v-if="item.value == ''"
                    ref="upload"
                    name="image"
                    action="http://192.168.10.50:8083/api/upload"
                    :format="['jpg', 'jpeg', 'png']"
                    :on-success="
                      (response) =>
                        handleBackgroundUpload(response, 'templateItem', index)
                    "
                  >
                    <Button
                      icon="ios-cloud-upload-outline"
                      style="width: 80px; height: 80px"
                    ></Button>
                  </upload>
                  <div class="uploadImg" v-else>
                    <img :src="getBackgroundImg(item.value)" alt="" />
                    <div class="mask">
                      <icon
                        type="ios-trash-outline"
                        style="font-size: 32px; color: #fff"
                        @click.native="
                          handleBackgroundBeforeDelete('templateItem', index)
                        "
                      ></icon>
                    </div>
                  </div>
                </div>
              </template>
              <Input type="text" v-model="item.value" v-else />
            </div>
          </div>
        </ListItem>
        <h1
          v-if="attrItem.length != 0"
          style="font-size: 24px; font-weight: bold"
        >
          属性
        </h1>
        <ListItem v-for="(item, index) in attrItem" :key="'attr' + index">
          <div class="list">
            <div class="left">{{ getAttrName(item.type) }}</div>
            <div class="right">
              <template v-if="editType == 'img'">
                <div>
                  <!-- :before-upload="e => handleBeforeUpload(e,'templateItem',index)" -->
                  <upload
                    style="margin-top: 5px"
                    v-if="item.value == ''"
                    ref="upload"
                    name="image"
                    action="http://192.168.10.50:8083/api/upload"
                    :format="['jpg', 'jpeg', 'png']"
                    :on-success="
                      (response) => handleSuccessEditUpload(response, index)
                    "
                  >
                    <Button
                      icon="ios-cloud-upload-outline"
                      style="width: 80px; height: 80px"
                    ></Button>
                  </upload>
                  <div class="uploadImg" v-else>
                    <img :src="item.value" alt="" />
                    <div class="mask">
                      <icon
                        type="ios-trash-outline"
                        style="font-size: 32px; color: #fff"
                        @click.native="handleEditDelete(index)"
                      ></icon>
                    </div>
                  </div>
                </div>
              </template>
              <Input type="text" v-model="item.value" v-else />
            </div>
          </div>
        </ListItem>
        <ListItem v-if="editType == 'a'">
          <div class="list">
            <div class="left">绑定弹窗</div>
          <div class="right">
            <!-- 弹窗绑定 下拉选择。 -->
            <!-- 不绑定了。 -->
            <!-- <Dropdown style="margin-left: 20px" @on-click="(e,index) => bindOverlay(e, index)"> 
              <Button type="primary">
                  选择弹窗
                  <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                  <DropdownItem v-for="(item, index) in overlayList" :key="index" :name="item.id">弹窗{{ index + 1 }}</DropdownItem>
              </DropdownMenu>
            </Dropdown> -->
            <Button type="primary" @click="editOverlay(isOlMaskIdEdit())">{{ isOlMaskIdEdit() ? '编辑': '添加' }}弹窗</Button>
          </div>
          </div>
        </ListItem>
      </List>
      <List v-if="templateType == 'templateView'">
        <template v-if="editType == 'swiper'">
          <h1
            v-if="styleItem.length != 0"
            style="font-size: 24px; font-weight: bold"
          >
            样式
          </h1>
          <ListItem v-for="(item, index) in styleItem" :key="'style' + index">
            <div class="list">
              <div class="left">{{ getAttrName(item.type) }}</div>
              <div class="right">
                <Input v-model="item.value" />
              </div>
            </div>
          </ListItem>
          <h1
            v-if="attrItem.length != 0"
            style="font-size: 24px; font-weight: bold"
          >
            属性
          </h1>
          <ListItem v-for="(item, index) in attrItem" :key="'attr' + index">
            <div class="list">
              <div class="left">{{ getAttrName(item.type) }}</div>
              <div class="right">
                <div v-if="item.type == 'list'">
                  <div
                    v-for="(uploadItem, uploadIndex) in item.value"
                    :key="'upload-' + uploadIndex"
                    style="
                      display: inline-block;
                      vertical-align: middle;
                      margin-left: 5px;
                    "
                  >
                    <div class="uploadImg">
                      <img :src="uploadItem.url" alt="" />
                      <div class="mask">
                        <icon
                          type="ios-trash-outline"
                          style="font-size: 32px; color: #fff"
                          @click.native="
                            handleSwiperListDelete(index, uploadIndex)
                          "
                        ></icon>
                      </div>
                    </div>
                  </div>
                  <upload
                    style="display: inline-block; margin-left: 5px"
                    v-if="item.value.length <= 5"
                    ref="swiperUpload"
                    name="image"
                    action="http://192.168.10.50:8083/api/upload"
                    :format="['jpg', 'jpeg', 'png']"
                    :on-success="
                      (response) =>
                        handleSuccessSwiperListUpload(response, index)
                    "
                  >
                    <Button
                      icon="ios-cloud-upload-outline"
                      style="width: 80px; height: 80px"
                    ></Button>
                  </upload>
                </div>
                <i-switch
                  v-if="item.type == 'loop' || item.type == 'autoplay'"
                  v-model="item.value"
                  @on-change="(e) => swiperValueChange(e, index)"
                />
                <Input
                  v-if="item.type == 'width' || item.type == 'height'"
                  v-model="item.value"
                />
              </div>
            </div>
          </ListItem>
        </template>
        <!-- <template v-if="editType == 'overlay'">
          <h1 style="font-size: 24px; font-weight: bold">属性</h1>
          <div v-for="(arrItem, arrIndex) in attrItem" :key="'arr-' + arrIndex">
            <h2 style="font-size: 18px; font-weight: bold">{{arrItem.type == 'img' ? '弹窗图片': '弹窗按钮'}}</h2>
            对象转换数组后v-model失效。（换成用index绑定数据就正常了）
            <ListItem v-for="(item, index) in objToArr(arrItem.value)" :key="'overlay-' + index">
            <div class="list">
              <div class="left">{{ getAttrName(item.name) }}</div>
              <div class="right">
                <template v-if="item.name == 'src' || item.name == 'backgroundImage'">
                  <upload
                    style="margin-top: 5px"
                    v-if="item.value == ''"
                    ref="upload"
                    name="image"
                    action="http://192.168.10.50:8083/api/upload"
                    :format="['jpg', 'jpeg', 'png']"
                    :on-success="
                      (response) => handleSuccessEditOverlayUpload(response, arrIndex, item.name)
                    "
                  >
                    <Button
                      icon="ios-cloud-upload-outline"
                      style="width: 80px; height: 80px"
                    ></Button>
                  </upload>
                  <div class="uploadImg" v-else>
                    <img :src="item.name == 'src'? item.value : getBackgroundImg(item.value)" alt="" />
                    <div class="mask">
                      <icon
                        type="ios-trash-outline"
                        style="font-size: 32px; color: #fff"
                        @click.native="handleEditOverlayDelete(arrIndex, item.name)"
                      ></icon>
                    </div>
                  </div>
                </template>
                <template v-else-if="item.name == 'padding' || item.name == 'margin'">
                  <div>
                    <InputNumber v-for="(item2, index2) in item.value" :key="index2" v-model="item.value[index2].value" />
                  </div>
                </template>
                <template v-else-if="item.name == 'borderStyle'">
                  <div>
                    <RadioGroup
                      v-model="arrItem.value[item.name]"
                      type="button"
                    >
                      <Radio label="solid"></Radio>
                      <Radio label="dashed"></Radio>
                      <Radio label="dotted"></Radio>
                    </RadioGroup>
                  </div>
                </template>
                <template v-else-if="item.name == 'textAlign'">
                  <div>
                    <RadioGroup
                      v-model="arrItem.value[item.name]"
                      type="button"
                    >
                      <Radio label="left"></Radio>
                      <Radio label="center"></Radio>
                      <Radio label="right"></Radio>
                    </RadioGroup>
                  </div>
                </template>
                <template v-else-if="item.name == 'color' || item.name == 'backgroundColor' || item.name == 'borderColor'">
                  <div>
                    <ColorPicker
                      v-model="arrItem.value[item.name]"
                      alpha
                    />
                  </div>
                </template>
                <template v-else>
                  <div>
                    <Input v-model="arrItem.value[item.name]" type="text" />
                  </div>
                </template>
              </div>
            </div>
          </ListItem>
          </div>
          <h1 style="font-size: 24px; font-weight: bold">样式</h1>
          <ListItem>
            <div class="list">
              <div class="left">弹窗背景颜色</div>
              <div class="right">
                <ColorPicker
                  v-model="styleItem[0].value"
                  alpha
                />
              </div>
            </div>
          </ListItem>
        </template> -->
      </List>
      <div class="demo-drawer-footer">
        <Button
          type="primary"
          style="margin-right: 8px"
          icon="ios-trash"
          @click="deleteDom"
          >删除该元素</Button
        >
        <Button type="primary" style="margin-right: 8px" @click="drawerSubmit"
          >修改</Button
        >
        <Button @click="drawerCancel">取消</Button>
      </div>
      <div class="addOverlayMask" v-show="addOverlayMaskShow">
        <div class="olMask">
          <textarea class="olText" v-show="olCntShow" v-model="overlayCnt.text" maxlength="100" @blur="olCntShow = !olCntShow" />
          <div class="text" v-show="!olCntShow" @click="olCntShow = !olCntShow">{{ overlayCnt.text }}</div>
          <div class="closeBtn"></div>
        </div>
        <Button type="primary" @click="closeOlMask(isOlMaskIdEdit())" style="margin-top: 20px;">完成</Button>
      </div>
    </Drawer>

    <Drawer
      title="修改body样式"
      v-model="bodyDrawerShow"
      width="720"
      :mask-closable="false"
    >
      <List>
        <ListItem>
          <div class="list">
            <div class="left">背景颜色</div>
            <div class="right">
              <ColorPicker v-model="editBodyStyle.backgroundColor" alpha />
            </div>
          </div>
        </ListItem>
        <ListItem>
          <div class="list">
            <div class="left">背景图片</div>
            <div class="right">
              <template>
                <div>
                  <!-- :before-upload="e => handleBeforeUpload(e,'templateItem',index)" -->
                  <upload
                    v-if="editBodyStyle.backgroundImage == ''"
                    style="margin-top: 5px"
                    ref="upload"
                    name="image"
                    action="http://192.168.10.50:8083/api/upload"
                    :format="['jpg', 'jpeg', 'png']"
                    :on-success="
                      (response) => handleSuccessBodyUpload(response)
                    "
                  >
                    <Button
                      icon="ios-cloud-upload-outline"
                      style="width: 80px; height: 80px"
                    ></Button>
                  </upload>
                  <div class="uploadImg" v-else>
                    <img :src="editBodyStyle.backgroundImage" alt="" />
                    <div class="mask">
                      <icon
                        type="ios-trash-outline"
                        style="font-size: 32px; color: #fff"
                        @click.native="handleBodyDelete()"
                      ></icon>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </ListItem>
      </List>
      <div class="demo-drawer-footer">
        <Button
          type="primary"
          style="margin-right: 8px"
          @click="BodyDrawerSubmit"
          >修改</Button
        >
        <Button @click="bodyDrawerCancel">取消</Button>
      </div>
    </Drawer>

    <!-- <input
      id="copy_content"
      type="text"
      value=""
      style="position: absolute; top: 0; left: 0; opacity: 0; z-index: -10"
    /> -->

    <Modal
      title="页面标题"
      v-model="createPageModalShow"
      @on-ok="getCreatePage"
    >
      <h3 style="margin-bottom: 20px">请输入页面标题</h3>
      <Input v-model="createPageTitle" />
      <div slot="footer">
        <Button type="primary" @click="getCreatePage">确认</Button>
        <Button @click="hideCreateModal">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import Sortable from "sortablejs";
import { attrNameList } from "@/assets/js/attrItemlist";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import { Component, Prop, Vue } from "vue-property-decorator";
import { component } from "vue/types/umd";

@Component({
  components: {
    Swiper,
    SwiperSlide,
  },
})
export default class home extends Vue {
  baseUrl: String = "http://cdn.tinytiger.cn/";
  attrNameList: Array<any> = attrNameList;
  containerIitem: Array<object> = [
    this.renderRow("container-1", "24", {
      padding: "0 0 0 0",
      margin: "0 0 0 0",
      backgroundColor: "#fff",
    }),
    this.renderRow("container-2", "12 12", {
      padding: "0 0 0 0",
      margin: "0 0 0 0",
      backgroundColor: "#fff",
    }),
    this.renderRow("container-3", "6 6 6 6", {
      padding: "0 0 0 0",
      margin: "0 0 0 0",
      backgroundColor: "#fff",
    }),
    this.renderRow("container-4", "18 6", {
      padding: "0 0 0 0",
      margin: "0 0 0 0",
      backgroundColor: "#fff",
    }),
  ];

  templateItem: Array<Object> = [
    this.renderElement(
      "文本",
      "p",
      {
        style: {
          textAlign: "left",
          fontSize: "30px",
          marginTop: "0px",
          marginLeft: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          paddingTop: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          paddingBottom: "0px",
          color: "rgba(0,0,0,1)",
        },
      },
      "我是文本"
    ),
    this.renderElement(
      "图片",
      "img",
      {
        style: {
          textAlign: "left",
          width: "100px",
          height: "100px",
          marginTop: "0px",
          marginLeft: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          paddingTop: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          paddingBottom: "0px",
          borderRadius: "15px",
        },
        attr: {
          src: "http://cdn.tinytiger.cn/20200910/baseavatar.png",
        },
      },
      ""
    ),
    this.renderElement(
      "按钮",
      "a",
      {
        style: {
          backgroundColor: "rgba(0,0,0,0)",
          backgroundImage: "url(https://cdn.tinytiger.cn/20201021/ex-btn.png)",
          width: "157px",
          height: "45px",
          textAlign: "center",
          borderWidth: "0px",
          borderColor: "rgba(0,0,0,0)",
          borderStyle: "solid",
          marginTop: "0px",
          marginLeft: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          paddingTop: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          paddingBottom: "0px",
          color: "rgba(0,0,0,1)",
          fontSize: "24px",
          borderRadius: "0px",
        },
        attr: {
          href: "http://www.baidu.com",
        },
      },
      "click"
    ),
  ];

  templateViewItem: Array<object> = [
    this.renderElement(
      "轮播图",
      "swiper",
      {
        style: {
          width: 200,
          height: 200,
        },
        attr: {
          loop: true,
          autoplay: true,
          list: [
            {
              url: "http://cdn.tinytiger.cn/20200910/baseavatar.png",
            },
            {
              url: "http://cdn.tinytiger.cn/20200910/baseavatar.png",
            },
            {
              url: "http://cdn.tinytiger.cn/20200910/baseavatar.png",
            },
          ],
        },
      },
      ""
    ),
    // this.renderElement('弹窗', 'overlay', {
    //   style: {
    //     backgroundColor: 'rgba(0,0,0,0.8)'
    //   },
    //   attr: {
    //     img: {
    //       src: 'http://cdn.tinytiger.cn/20200910/baseavatar.png',
    //       width: '100px',
    //       height: '100px',
    //       margin: '0px 0px 20px 0px',
    //       padding: '0px 0px 0px 0px',
    //     },
    //     closeBtn: {
    //       value: 'close',
    //       backgroundColor: "rgba(0,0,0,0)",
    //       backgroundImage: "url(https://cdn.tinytiger.cn/20201021/ex-btn.png)",
    //       width: "157px",
    //       height: "45px",
    //       textAlign: "center",
    //       borderWidth: "0px",
    //       borderColor: "rgba(0,0,0,0)",
    //       borderStyle: "solid",
    //       margin: '0 0 0 0',
    //       padding: '0 0 0 0',
    //       color: "rgba(0,0,0,1)",
    //       fontSize: "24px",
    //       borderRadius: "0px",
    //     }
    //   }
    // }, '')
  ];

  overlayList: Array<any> = [];

  addOverlayMaskShow: boolean = false;

  overlayCnt: Object = {
    text: '我是弹窗'
  }

  olCntShow: boolean = false;

  colEditBtnShow: boolean = true;

  attrItem: Array<any> = [];

  styleItem: Array<any> = [];

  valueItem: String = "";

  createAttrItem: Array<Object> = [{ name: "", value: [] }];

  createItem: Array<Object> = [];

  colDrawerShow: boolean = false;

  drawerShow: boolean = false;

  bodyDrawerShow: boolean = false;

  bodyStyle: Object = {
    backgroundColor: "rgba(255,255,255,1)",
    // backgroundImage: "http://cdn.tinytiger.cn/20201023/bodybg.jpg",
    backgroundImage: ''
  };

  editBodyStyle: Object = {
    backgroundColor: "rgba(255,255,255,1)",
    // backgroundImage: "http://cdn.tinytiger.cn/20201023/bodybg.jpg",
    backgroundImage: ''
  };

  createHtml: String = "";

  edit: Array<any> = [];

  editType: String = "";

  templateType: String = "";

  swiperViewShow: boolean = true;

  createPageTitle: String = "";

  createPageModalShow: boolean = false;

  changeType: String = "pc";

  options: Object = { group: { name: "site", pull: "clone" }, sort: true };

  mounted() {
    this.$nextTick(() => {
      Sortable.create(document.getElementById("templateItem1"), {
        group: {
          name: "site",
          pull: "clone",
          put: false, // 不允许拖拽进这个列表
        },
        animation: 150,
        sort: false, // 设为false，禁止sort
        onStart: (evt: any) => {
          console.log(evt);
        },
        onAdd: (e: any) => {
          console.log(e);
        },
      });

      Sortable.create(document.getElementById("templateItem2"), {
        group: {
          name: "site",
          pull: "clone",
          fallbackOnBody: true,
          put: false, // 不允许拖拽进这个列表
        },
        animation: 150,
        sort: false, // 设为false，禁止sort
        onStart: (evt: any) => {
          console.log(evt);
        },
        onAdd: (e: any) => {
          console.log(e);
        },
      });

      Sortable.create(document.getElementById("templateItem3"), {
        group: {
          name: "site",
          pull: "clone",
          put: false, // 不允许拖拽进这个列表
        },
        animation: 150,
        sort: false, // 设为false，禁止sort
        onStart: (evt: any) => {
          console.log(evt);
        },
        onAdd: (e: any) => {
          console.log(e);
        },
      });

      this.createMainInit();
    });
  }

  renderRow(name: String, col: String, target: any) {
    return {
      name: name,
      col: col,
      ...target,
    };
  }

  renderElement(name: String, tag: String, target: any, text: String) {
    let datas: any = {
      name: name,
      tag: tag,
      value: text,
    };
    target.style ? (datas["style"] = target.style) : "";
    target.attr ? (datas["attr"] = target.attr) : "";
    return datas;
  }

  createMainInit() {
    var nestedSortables = [].slice.call(
      document.querySelectorAll(".create-main")
    );
    // console.log(nestedSortables);
    for (var i = 0; i < nestedSortables.length; i++) {
      Sortable.create(nestedSortables[i], {
        group: "site",
        animation: 150,
        fallbackOnBody: true,
        filter: ".colEditBtn",
        onAdd: (e: any) => {
          let $createView = document.getElementById("createItem");
          let $itemView = e.item;
          if (e.from.getAttribute("class") || "".indexOf("create-main") != -1) {
          } else {
            e.from.replaceChild($itemView, e.clone);
          }
          let item = e.item.getAttribute("data-item");
          if (item == "containerIitem") {
            let data = this.deepCopy((this as any)[item][e.oldIndex]);
            let col = data.col.split(" ");
            let attr = {
              padding: data.padding,
              margin: data.margin,
              backgroundColor: data.backgroundColor,
            };
            let colData = {
              item: item,
              col: col.map((v: any, i: Number) => {
                return {
                  col: v,
                  attr: attr,
                  child: [],
                };
              }),
            };
            this.createItem.push(colData);
          } else if (!item) {
            let rowIndex = e.srcElement.parentElement.dataset.index || null;
            if (
              e.item.getAttribute("data-templateItem") == "templateItem" &&
              !rowIndex
            ) {
              this.$Message.info({
                render: (h: any) => {
                  return h("span", {}, "基本样式需在container里。");
                },
              });
              let $itemView = e.item;
              e.from.appendChild($itemView);
              return false;
            }
          } else if (item == "templateViewItem") {
            let rowIndex = e.srcElement.parentElement.dataset.index || null;
            let colIndex = e.srcElement.dataset.index2 || null;
            let data = this.deepCopy((this as any)[item][e.oldIndex]);
            if (rowIndex) {
              let datas = {
                item: item,
                templateType: "templateView",
                ...data
              };
              (this as any).createItem[Number(rowIndex)]["col"][
                Number(colIndex)
              ].child.push(datas);
              // if(data.tag == "overlay"){
              //   this.$nextTick(() => {
              //     console.log(rowIndex, colIndex, e)
              //     let $overlayMask = document.getElementsByClassName('overlayMask')
              //     console.log($overlayMask, $overlayMask.length)
              //     for(let i = 0,len = $overlayMask.length; i < len; i ++){
              //       let overlayId = $overlayMask[i].getAttribute('data-overlayId')
              //       let datas = {
              //         id: overlayId
              //       }
              //       this.overlayList.push(datas)
              //     }
              //   })
              // }
            } else {
              this.$Message.info({
                render: (h: any) => {
                  return h("span", {}, "组件需在container里。");
                },
              });
            }
          } else if (item == "templateItem") {
            let rowIndex = e.srcElement.parentElement.dataset.index || null;
            let colIndex = e.srcElement.dataset.index2 || null;
            let data = this.deepCopy((this as any)[item][e.oldIndex]);
            let datas = {
              item: item,
              templateType: "template",
              ...data,
            };
            if (rowIndex) {
              (this as any).createItem[Number(rowIndex)]["col"][
                Number(colIndex)
              ].child.push(datas);
            } else {
              this.$Message.info({
                render: (h: any) => {
                  return h("span", {}, "基本样式需在container里。");
                },
              });
            }
          }
          this.$nextTick(() => {
            this.createMainInit();
          });
        },
      });
    }
  }

  editOverlay(type: boolean): void {
    if(type){
      let $a = `a-${this.edit[0]}-${this.edit[1]}-${this.edit[2]}`
      let _index = this.overlayList.findIndex((v, i) => {
        return v.id == $a
      })
      let datas: any = (this.overlayList as any)[_index];
      (this.overlayCnt as any).text = datas.text;
    }
    this.addOverlayMaskShow = true
    let $ivuBody = document.querySelectorAll('#template-create-drawer .ivu-drawer-body')[0];
    ($ivuBody as any).scrollTo(0, 0);
    ($ivuBody as any).style.overflow = 'hidden';
  }

  closeOlMask(type: boolean): void {
    let $ivuBody = document.querySelectorAll('#template-create-drawer .ivu-drawer-body')[0];
    ($ivuBody as any).style.overflow = ''
    this.addOverlayMaskShow = false
    let $a = `a-${this.edit[0]}-${this.edit[1]}-${this.edit[2]}`
    if(type){
      let _index = this.overlayList.findIndex((v, i) => {
        return v.id == $a
      })
      this.overlayList[_index] = {
        id: $a,
        text: (this.overlayCnt as any).text,
      }
    }else{
      this.overlayList.push({
        id: $a,
        text: (this.overlayCnt as any).text,
      })
    }
    (this.overlayCnt as any).text = '我是弹窗'
    this.olCntShow = false
  }

  isOlMaskIdEdit(){
    let $a = `a-${this.edit[0]}-${this.edit[1]}-${this.edit[2]}`
    return this.overlayList.findIndex((v, i) => {
      return v.id == $a
    }) != -1
  }

  onTemplateStart(): void {}
  onTemplateEnd(e: any): void {}
  onTemplateMove(): void {}
  onCreateStart(): void {}
  onCreateEnd(): void {}

  getAttrName(name: string): void {
    let attrName = this.attrNameList.filter((v) => {
      return Object.keys(v).some((j, k) => {
        if (name == j) {
          return v[j];
        }
      });
    });
    return attrName.length == 0 ? name : attrName[0][name];
  }

  deepCopy(json: Object) {
    if (typeof json !== "object") {
      return false;
    }

    return JSON.parse(JSON.stringify(json));
  }

  nodeDomEdit(
    type: String,
    index: any,
    index2: any,
    index3?: any,
    e?: any
  ): void {
    let attrList: any = [];
    let styleList: any = [];
    let data: Array<Object> = [];
    if (type == "col") {
      data = (this as any).createItem[index]["col"][index2];
      let arrList: any = (data as any).attr;
      let createAttrList = [];
      for (let key in arrList) {
        let arrDatas = {
          name: key,
          value:
            key == "backgroundColor"
              ? arrList[key]
              : arrList[key].split(" ").map((v: string) => {
                  return Number(v);
                }),
        };
        createAttrList.push(arrDatas);
      }
      this.edit = [index, index2];
      this.createAttrItem = createAttrList;
      this.colDrawerShow = true;
    } else {
      data = (this as any).createItem[index]["col"][index2]["child"][index3];
      this.templateType = (data as any).templateType;
      for (let key in (data as any).attr) {
        let attrDatas = {
          type: key,
          value: (data as any).attr[key],
        };
        attrList.push(attrDatas);
      }
      for (let key in (data as any).style) {
        let styleDatas = {
          type: key,
          value: (data as any).style[key],
        };
        styleList.push(styleDatas);
      }
      // if((data as any).tag == 'overlay'){
      //   attrList.map((v: any, i: any) => {
      //     for(let key in v.value){
      //       if((key == 'margin' && typeof v.value[key] == 'string') || (key == 'padding' && typeof v.value[key] == 'string')){
      //         v.value[key] = v.value[key].split(' ').map((m: any, n: Number) => {
      //           return {
      //             value: Number(m.replace(/px/g, "")),
      //           };
      //         });
      //       }
      //     }
      //   })
      // }
      this.attrItem = attrList;
      this.styleItem = styleList;
      this.valueItem = (data as any).value;
      this.editType = (data as any).tag;
      this.drawerShow = true;
      this.edit = [index, index2, index3];
    }
  }

  getStylesTree(attrs: Object): String {
    let str = "";
    for (let key in attrs) {
      let keyLine = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      let style =
        keyLine +
        ": " +
        (this.changeType == "pc"
          ? (attrs as any)[key]
          : this.pxtorem((attrs as any)[key])) +
        ";";
      str += style;
    }
    return str;
  }

  objToArr(json: any){
    if (typeof json !== "object") {
      return false;
    }
    let arr = []
    for(let key in json){
      let datas = {
        name: key,
        value: json[key]
      }
      arr.push(datas)
    }
    return arr
  }

  getElement(item: any, index: any, index2: any, index3: any): void {
    let dom = document.createElement(item.tag);
    dom.innerHTML = item.value;
    for (let key in item.attr) {
      if (item.tag == "a") {
        dom.setAttribute("target", "_blank");
      }
      dom.setAttribute(key, item.attr[key]);
    }
    let styleStr = this.getStylesTree((item as any).style);
    dom.setAttribute("style", styleStr);
    dom.setAttribute('id', `${item.tag}-${index}-${index2}-${index3}`)
    if (item.tag == "a") {
      dom.style.cssText +=
        "display: inline-flex;justify-content: center;align-items: center;";
    }
    return dom.outerHTML;
  }

  getInput(inputStr: String) {
    return inputStr.split(" ").map((v: any, i: Number) => {
      return {
        value: Number(v.replace(/px/g, "")),
      };
    });
  }

  drawerCancel() {
    this.drawerShow = false;
  }

  drawerSubmit() {
    let attrList: any = {};
    let styleList: any = {};
    this.attrItem.map((v, i) => {
      attrList[v.type] = v.value;
    });
    this.styleItem.map((v, i) => {
      styleList[v.type] = v.value;
    });
    let list = (this as any).createItem[this.edit[0]]["col"][this.edit[1]][
      "child"
    ][this.edit[2]];
    list.value = this.valueItem;
    list.attr = attrList;
    list.style = styleList;
    this.swiperViewShow = false;
    // if(this.editType == 'overlay'){
    //   console.log(this.attrItem)

    //   attrList.closeBtn.padding = attrList.closeBtn.padding.map((v: any,i: any) => {
    //     return this.changeType == 'pc' ? v.value + 'px' : this.pxtorem(v.value) + 'rem'
    //   }).join(' ')
    //   attrList.closeBtn.margin = attrList.closeBtn.margin.map((v: any,i: any) => {
    //     return this.changeType == 'pc' ? v.value + 'px' : this.pxtorem(v.value) + 'rem'
    //   })
    //   attrList.img.padding = attrList.img.padding.map((v: any,i: any) => {
    //     return this.changeType == 'pc' ? v.value + 'px' : this.pxtorem(v.value) + 'rem'
    //   }).join(' ')
    //   attrList.img.margin = attrList.img.margin.map((v: any,i: any) => {
    //     return this.changeType == 'pc' ? v.value + 'px' : this.pxtorem(v.value) + 'rem'
    //   }).join(' ')
    // }
    setTimeout(() => {
      this.swiperViewShow = true;
      this.drawerShow = false;
    }, 100);
  }

  BodyDrawerSubmit(): void {
    let datas = this.deepCopy(this.editBodyStyle);
    this.bodyStyle = datas;
    this.bodyDrawerShow = false;
  }

  bodyDrawerCancel(): void {
    let datas = this.deepCopy(this.bodyStyle);
    this.editBodyStyle = datas;
    this.bodyDrawerShow = false;
  }

  deleteDom(): void {
    (this as any).createItem[this.edit[0]]["col"][this.edit[1]]["child"].splice(
      [this.edit[2]],
      1
    );
    this.drawerShow = false;
  }

  ColDeleteDom(): void {
    (this as any).createItem.splice(this.edit[0], 1);
    this.colDrawerShow = false;
  }

  ColDrawerSubmit() {
    let datas: any = {};
    this.createAttrItem.map((v) => {
      (datas as any)[(v as any).name] =
        (v as any).name == "backgroundColor"
          ? (v as any).value
          : (v as any).value.join(" ");
    });
    (this as any).createItem[this.edit[0]]["col"][this.edit[1]].attr = datas;
    this.colDrawerShow = false;
  }

  ColDrawerCancel() {
    this.colDrawerShow = false;
  }

  showBodyDrawer(): void {
    this.bodyDrawerShow = true;
  }

  async handleSuccessUpload(res: Object, item: any, index: any): Promise<any> {
    // const res = await this.getFileUrl(e);
    let url = (res as any).data.url;
    (this as any)[item][index].attr.src = url;
  }

  async handleSuccessEditUpload(res: any, i: any): Promise<any> {
    console.log(this.attrItem[i])
    // let url = res.data.url;
    // this.attrItem[i].value = url;
  }

  // handleSuccessEditOverlayUpload(res: any, i: any, key: any): any {
  //   let url = key == 'backgroundImage'? `url(${res.data.url})`: res.data.url;
  //   (this as any)['attrItem'][i].value[key] = url;
  // }

  async handleBackgroundUpload(res: any, item: any, index: any): Promise<any> {
    let url = `url(${res.data.url})`;
    (this as any)["styleItem"][index].value = url;
  }

  handleSuccessBodyUpload(res: any): any {
    let url = res.data.url;
    (this.editBodyStyle as any).backgroundImage = url;
  }

  handleBackgroundBeforeDelete(item: any, i: any): void {
    (this as any)["styleItem"][i].value = "";
  }

  handleBeforeDelete(item: any, i: any): void {
    (this as any)[item][i].attr.src = "";
  }

  handleEditDelete(i: any): void {
    this.attrItem[i].value = "";
  }

  // handleEditOverlayDelete(i: any, key: any): void {
  //   this.attrItem[i].value[key] = "";
  // }

  handleBodyDelete(): void {
    (this.editBodyStyle as any).backgroundImage = "";
  }

  swiperValueChange(e: boolean, index: any): void {
    this.attrItem[index]["value"] = e;
  }

  handleSuccessSwiperListUpload(res: Object, index: any): void {
    let url = (res as any).data.url;
    this.attrItem[index].value.push({
      url: url,
    });
  }

  handleSwiperListDelete(index: any, uploadIndex: Number): void {
    this.attrItem[index].value.splice(uploadIndex, 1);
  }

  setStyleVal(val: String): String {
    return val
      .split(" ")
      .map((v: any) => {
        return this.changeType == "pc" ? v + "px" : v / 75 + "rem";
      })
      .join(" ");
  }

  getHttpStatus(): String {
    return document.location.protocol == "https:" ? "https:" : "http:";
  }

  hideCreateModal() {
    this.createPageTitle = "";
    this.createPageModalShow = false;
  }

  getCreatePage() {
    if (this.createPageTitle.trim() == "") {
      this.$Message.error("请输入页面标题");
      return false;
    }
    this.createPageModalShow = false;
    this.colEditBtnShow = false;
    setTimeout(() => {
      let html = this.createPageHtml();
      const _this = this;
      this.$Modal.confirm({
        width: 800,
        okText: "下载",
        render: (h: any) => {
          return h(
            "pre",
            {
              style: {
                minHeight: "500px",
                overflowY: "auto",
              },
            },
            html
          );
        },
        onOk() {
          // let $input: any = document.getElementById("copy_content");
          // $input.value = html;
          // $input.select();
          // document.execCommand("copy");
          // this.$Message.success("复制成功");
          _this.download("index.html", html);
          _this.createPageTitle = "";
        },
        onCancel() {
          _this.createPageTitle = "";
        },
      });
    }, 200);
  }

  createPageHtml(): String {
    let $div = document.createElement("div");
    $div.innerHTML = (document.getElementById("createItem") as any).innerHTML;
    this.colEditBtnShow = true;
    let $swiper = $div.getElementsByClassName("swiper");
    let swiperDatas: Array<Object> = [];
    this.createItem.map((v: any, i: any) => {
      v.col.map((j: any, k: any) => {
        j.child.map((m: any, n: any) => {
          if (m.tag == "swiper") {
            let data = {
              ...m,
              id: "swiper-" + i + "-" + k + "-" + n,
            };
            swiperDatas.push(data);
          }
        });
      });
    });
    let swiperJs: String = swiperDatas
      .map((v: any, i: any) => {
        return `var Swiper${i} = new Swiper ('#${v.id}', {
          loop: ${v.attr.loop}, 
          autoplay: ${v.attr.autoplay}
        })`;
      })
      .join(";");

    let datasSc = ''

    datasSc += swiperJs
    let olDatas: String = '';
    let olSc: String = '';
    if(this.overlayList.length != 0){
      olDatas = this.overlayList.map((v, i) => {
        return `<div class="mask" id="mask-${v.id}">
          <div class="w">
            <div class="olMask">
              <div class="text">${v.text}</div>
              <div class="closeBtn" onclick="closeMask('${v.id}');"></div>        
            </div>
          </div>
        </div>`
      }).join('');

      olSc = this.overlayList.map((v, i) => {
        return `
          let $${v.id.replace(/-/g, '_')} = document.getElementById("${v.id}");
          $${v.id.replace(/-/g, '_')}.onclick = function(e){
            e.preventDefault();
            let $mask = document.getElementById("mask-${v.id}");
            $mask.style.display = 'flex';
          }
        `
      }).join(';');
    }
    datasSc += olSc

    datasSc = datasSc != ''? `<script>
      window.onload = function(){
        ${datasSc}
      };
      </\script>`: '';

    let html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, minimal-ui, viewport-fit=cover">
            <link rel="stylesheet" href="${this.getHttpStatus()}//cdn.tinytiger.cn/20201021/base.css">
            <link rel="stylesheet" href="${this.getHttpStatus()}//cdn.tinytiger.cn/20201015/iview.css">
            ${
              swiperJs != ""
                ? '<link rel="stylesheet" href="' +
                  this.getHttpStatus() +
                  '//cdn.tinytiger.cn/20201016/swiper.min.css">'
                : ""
            }
            ${
              swiperJs != ""
                ? '<script src="' +
                  this.getHttpStatus() +
                  '//tinytiger.cn/js/swiper.min.js"></\script>'
                : ""
            }
            ${
              this.changeType == "pc"
                ? ""
                : '<script src="' +
                  this.getHttpStatus() +
                  '//cdn.tinytiger.cn/20201016/rem.js"></\script>'
            }
            <style>
              .w{
                width: 1280px;
                margin: 0 auto;
              }

              body{
                background-color: ${(this.bodyStyle as any).backgroundColor};
                background-image: url('${
                  (this.bodyStyle as any).backgroundImage
                }');
                background-size: 100% auto;
                background-repeat: no-repeat;
                background-position: center top;
              }
              a[id^=a-] {
                background-position: center top;
                background-size: 100% 100%;
                background-repeat: no-repeat;
              }
              .mask {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 9;
                display: none;
              }
              .mask .w .olMask {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 100%;
                height: 100%;
              }
              .mask .w .olMask .text {
                padding: 0 5vw;
                font-size: 5vw;
                color: #fff;
                background: rgba(0, 0, 0, 0);
                word-break: break-word;
                min-height: 300px;
                width: 100%;
                box-sizing: border-box;
                text-align: center;
              }
              .mask .w .olMask .closeBtn {
                background: url('http://cdn.tinytiger.cn/20201130/close-btn.png') no-repeat center top / 100% 100%;
                width: 49px;
                height: 49px;
                margin-top: 20px;
              }
              .swiper-container {
                width: 100%;
              }
              .swiper-container .swiper-slide .cover {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
              }
              .swiper-container .swiper-slide .cover img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              @media screen and (max-width: 760px) {
                .w{
                  width: 100%;
                }
              }
            </style>
            <title>${this.createPageTitle}</title>
          </head>
          <body>
            <div class="w">
              ${$div.innerHTML}
              ${olDatas}
            </div>
            ${datasSc}
            ${ this.overlayList.length != 0 ? `<script>
            function closeMask(id) {
              let $mask = document.getElementById("mask-" + id);
              $mask.style.display = 'none';
            };
            </\script>` : '' }
          </body>
        </html>`;
    return html;
  }

  download(filename: String, text: String) {
    var pom: any = document.createElement("a");
    pom.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + (encodeURIComponent as any)(text)
    );
    pom.setAttribute("download", filename);
    if (document.createEvent) {
      var event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  }

  changeCreateType(type: String) {
    this.changeType = type;
    let $Html = document.getElementsByTagName("html")[0];
    if (type == "wap") {
      $Html.style.fontSize = "37.5px";
    } else {
      $Html.style.fontSize = "";
    }
  }

  pxtorem(str: String) {
    if (!(new RegExp("[0-9]") as any).test(str)) {
      return str;
    }
    if (str.indexOf("rgba") != -1) {
      return str;
    }
    if (str.indexOf("%") != -1) {
      return str;
    }
    if (str.indexOf("url") != -1) {
      return str;
    }
    if (str.indexOf(" ") != -1) {
      return str
        .split(" ")
        .map((v, i) => {
          return (parseInt(str.replace(/px/g, "")) / 75).toFixed(4) + "rem";
        })
        .join(" ");
    } else {
      return (parseInt(str.replace(/px/g, "")) / 75).toFixed(4) + "rem";
    }
  }

  getBackgroundImg(str: any): any {
    let result = str.match(/\((.+)\)/g)[0];
    return result.substring(1, result.length - 1);
  }

  // closeOverlay(id: string, e: any): any {
  //   e.stopPropagation();
  //   const $OverlayMask = document.getElementsByClassName('overlayMask')
  //   for(let i = 0,len = $OverlayMask.length; i< len; i ++){
  //     if($OverlayMask[i].getAttribute('data-overlayId') == id){
  //       ($OverlayMask[i] as any).style.display = 'none';
  //       ($OverlayMask[i] as any).style.zIndex = '-9999'
  //     }
  //   }
  // }

  // bindOverlay(e: any){
  //   console.log(e)
  // }
}
</script>
<style lang="less">
.create-Home {
  width: 100%;
  height: 100vh;
  .templateItem {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 5px 20px;
    + .templateItem {
      border-top: 1px solid #eee;
    }
    p {
      width: 100%;
      font-size: 12px;
    }
    .ivu-input-wrapper {
      padding-top: 5px;
      width: 100%;
    }
    .uploadImg {
      width: 70px;
      height: 70px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        display: none;
        align-items: center;
        justify-content: center;
      }
      &:hover {
        .mask {
          display: flex;
        }
      }
    }
  }
  .ivu-layout-has-sider {
    height: calc(100vh - 64px);
  }
  .create-main {
    &#createItem{
      position: relative;
    }
    &.flex-center {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: bold;
      color: #000;
      text-align: center;
      padding: 0 10px;
    }
    &.main-con {
      width: 100%;
      height: 100%;
    }
    .ivu-row-flex {
      .ivu-col {
        position: initial;
        // min-height: 60px;
      }
    }
    .colEditBtn {
      display: block;
    }
    a {
      pointer-events: none;
    }
    .swiper-container {
      width: 100%;
      .swiper-slide {
        .cover {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
}
.list {
  display: flex;
  width: 100%;
  .left {
    width: 30%;
  }
  .right {
    .ivu-input-number {
      + .ivu-input-number {
        margin-left: 20px;
      }
    }

    width: 70%;
    .uploadImg {
      width: 80px;
      height: 80px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        display: none;
        align-items: center;
        justify-content: center;
      }
      &:hover {
        .mask {
          display: flex;
        }
      }
    }
  }
}

// .overlay{
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   z-index: 9;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   .closeBtn{
//     background-repeat: no-repeat;
//     background-position: center top;
//     background-size: 100% 100%;
//     cursor: pointer;
//   }
// }
.ivu-drawer-body {
  padding: 16px 16px 0;
  position: relative;
  .ivu-list {
    min-height: calc(100% - 53px);
  }
}
.demo-drawer-footer {
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
  position: sticky;
  bottom: 0;
  left: 0;
  z-index: 9;
}
.addOverlayMask {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .olMask{
    width: 375px;
    height: 665px;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .text{
      padding: 0 20px;
      font-size: 20px;
      color: #fff;
      background: rgba(0, 0, 0, 0);
      word-break: break-word;
    }
    .olText{
      padding: 10px;
      font-size: 20px;
      color: #fff;
      background: rgba(0, 0, 0, 0);
      word-break: break-word;
      height: 300px;
      resize: none;
    }
    .closeBtn{
      background: url('http://cdn.tinytiger.cn/20201130/close-btn.png') no-repeat center top / 100% 100%;
      width: 49px;
      height: 49px;
      margin-top: 20px;
    }
  }
}
.ivu-upload-list {
  display: none;
}
</style>