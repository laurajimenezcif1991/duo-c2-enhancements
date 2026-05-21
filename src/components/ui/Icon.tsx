/**
 * Icon — Smart Terminal Glass 2.0
 *
 * All 400+ SVG icons wired from assets/icons/.
 * All icons use static ES module imports (dynamic require is not supported on web).
 *
 * Usage:
 *   <Icon name="search"         size={24} color={Colors.textPrimary} />
 *   <Icon name="card-reader"    size={24} color={Colors.contentAccent1} />
 *   <Icon name="payment-cash"   size={48} />
 *   <Icon name="nav-back"       size={20} color="#fff" />
 */

import React, { useContext } from 'react';
import { SvgProps } from 'react-native-svg';
import { View, ViewStyle } from 'react-native';
import { ButtonColorContext } from './ButtonColorContext';

type SvgC = React.FC<SvgProps>;

// ─── Navigation (SystemBar) ───────────────────────────────────────────────────
import NavBackSvg     from '../../../assets/icons/register icons/akar-icons_triangle-fill.svg';
import NavHomeSvg     from '../../../assets/icons/register icons/akar-icons_circle-fill.svg';
import NavRecentSvg   from '../../../assets/icons/register icons/akar-icons_square-fill.svg';

// ─── Payment method types (Type= prefix) ─────────────────────────────────────
import PaymentCreditCardSvg  from '../../../assets/icons/Type=credit-card.svg';
import PaymentCashSvg        from '../../../assets/icons/Type=cash.svg';
import PaymentWalletSvg      from '../../../assets/icons/Type=wallet.svg';
import PaymentLoyaltySvg     from '../../../assets/icons/Type=loyalty.svg';
import PaymentEbtSvg         from '../../../assets/icons/Type=EBT.svg';
import PaymentQrSvg          from '../../../assets/icons/Type=QR.svg';
import PaymentOtherSvg       from '../../../assets/icons/Type=other.svg';
import PaymentMultiTenderSvg from '../../../assets/icons/Type=multi-tender.svg';
import PaymentFingerprintSvg from '../../../assets/icons/Type=finger-print.svg';

// ─── 24px subfolder ───────────────────────────────────────────────────────────
import Register24Svg    from '../../../assets/icons/register.svg';
import Drawer24Svg      from '../../../assets/icons/drawer.svg';
import Dollar24Svg      from '../../../assets/icons/dollar.svg';
import Discount24Svg    from '../../../assets/icons/discount.svg';
import UserAdd24Svg     from '../../../assets/icons/user-add.svg';
import Save24Svg        from '../../../assets/icons/save.svg';
import CheckFilled24Svg from '../../../assets/icons/check-filled.svg';
import Draw24Svg        from '../../../assets/icons/draw.svg';
import Barcode24Svg     from '../../../assets/icons/bar-code.svg';

// ─── Poynt card payment ───────────────────────────────────────────────────────
import PoyntCardPaymentSvg from '../../../assets/icons/poynt-card-payment.svg';

// ─── Card reader states ───────────────────────────────────────────────────────
// @ts-ignore — spaces in filename are valid for static imports
import CardReaderSvg           from '../../../assets/icons/card-reader _ 24.svg';
// @ts-ignore
import CardReaderDiscSvg       from '../../../assets/icons/card-reader-disconnected _ 24.svg';
// @ts-ignore
import CardReaderChargingSvg   from '../../../assets/icons/card-reader-charging _ 24.svg';
// @ts-ignore
import CardReaderBat10Svg      from '../../../assets/icons/card-reader-10 _ 24.svg';
// @ts-ignore
import CardReaderBat25Svg      from '../../../assets/icons/card-reader-25 _ 24.svg';
// @ts-ignore
import CardReaderBat50Svg      from '../../../assets/icons/card-reader-50 _ 24.svg';
// @ts-ignore
import CardReaderBat75Svg      from '../../../assets/icons/card-reader-75 _ 24.svg';
// @ts-ignore
import CardReaderBat100Svg     from '../../../assets/icons/card-reader-100 _ 24.svg';
// @ts-ignore
import CardReaderSellMode24Svg from '../../../assets/icons/card-reader-sell-mode _ 24.svg';
// @ts-ignore
import CardReaderSellMode32Svg from '../../../assets/icons/card-reader-sell-mode _ 32.svg';

// ─── Payment / transaction 24px ───────────────────────────────────────────────
// @ts-ignore
import TtpSvg              from '../../../assets/icons/TTP _ 24.svg';
// @ts-ignore
import TtpFilledSvg        from '../../../assets/icons/TTP-filled _ 24.svg';
// @ts-ignore
import Bank24Svg           from '../../../assets/icons/bank _ 24.svg';
// @ts-ignore
import Transaction24Svg    from '../../../assets/icons/transaction _ 24.svg';
// @ts-ignore
import TransactionFil24Svg from '../../../assets/icons/transaction-filled _ 24.svg';
// @ts-ignore
import CardTx24Svg         from '../../../assets/icons/card-transaction _ 24.svg';
// @ts-ignore
import Tag24Svg            from '../../../assets/icons/tag _ 24.svg';
// @ts-ignore
import TagFilled24Svg      from '../../../assets/icons/tag-filled _ 24.svg';

// ─── Hardware status 32px ─────────────────────────────────────────────────────
// @ts-ignore
import Contactless32Svg     from '../../../assets/icons/contactless _ 32.svg';
// @ts-ignore
import ContactlessFill32Svg from '../../../assets/icons/contactless-filled _ 32.svg';
// @ts-ignore
import PhoneError32Svg      from '../../../assets/icons/phone-error _ 32.svg';
// @ts-ignore
import BluetoothError32Svg  from '../../../assets/icons/bluetooth-error _ 32.svg';
// @ts-ignore
import DeviceWarning32Svg   from '../../../assets/icons/device-warning _ 32.svg';
// @ts-ignore
import NetworkError32Svg    from '../../../assets/icons/network-error _ 32.svg';
// @ts-ignore
import LcrError32Svg        from '../../../assets/icons/lcr-error _ 32.svg';
// @ts-ignore
import Scanner32Svg         from '../../../assets/icons/scanner _ 32.svg';
// @ts-ignore
import CashPayment32Svg     from '../../../assets/icons/cash-payment _ 32.svg';
// @ts-ignore
import CardPayment32Svg     from '../../../assets/icons/card-payment _ 32.svg';
import CardBankSvg          from '../../../assets/icons/card-bank.svg';
import CashSvg              from '../../../assets/icons/cash.svg';
import EbtSvg               from '../../../assets/icons/ebt.svg';

// ─── Large 60px (using available alternatives) ────────────────────────────────
import Layers60Svg      from '../../../assets/icons/layers.svg';
import Invoice60Svg     from '../../../assets/icons/invoice.svg';
// @ts-ignore
import BankLg60Svg      from '../../../assets/icons/bank _ 24.svg';
import CircleHelp60Svg  from '../../../assets/icons/circle.svg';
import List60Svg        from '../../../assets/icons/bulleted-list.svg';
import RegisterLg60Svg  from '../../../assets/icons/register.svg';
import Apps60Svg        from '../../../assets/icons/apps.svg';
// @ts-ignore
import Catalog60Svg     from '../../../assets/icons/catalog 2.svg';
// @ts-ignore
import TxLg60Svg        from '../../../assets/icons/transaction _ 24.svg';
import ManualEntry60Svg from '../../../assets/icons/edit.svg';
import Receipt60Svg     from '../../../assets/icons/receipt.svg';
import Orders60Svg      from '../../../assets/icons/orders.svg';
// @ts-ignore
import CardTxLg60Svg   from '../../../assets/icons/card-transaction _ 24.svg';

// ─── Register icon set ────────────────────────────────────────────────────────
import OkFilledSvg          from '../../../assets/icons/register icons/ok-filled.svg';
import DollarFilledSvg      from '../../../assets/icons/register icons/dollar.svg';
import BarcodeFilledSvg     from '../../../assets/icons/register icons/bar-code.svg';
import BarcodeAltSvg        from '../../../assets/icons/register icons/bar-code-1.svg';
import ArrowUpRegSvg        from '../../../assets/icons/register icons/arrow-up.svg';
import UserAddFilledSvg     from '../../../assets/icons/register icons/user-add.svg';
import InfoRegSvg           from '../../../assets/icons/register icons/information.svg';
import DrawFilledSvg        from '../../../assets/icons/register icons/draw.svg';
import PointOfSaleSvg       from '../../../assets/icons/register icons/point-of-sale.svg';
import CardReaderDiscRegSvg from '../../../assets/icons/register icons/card-reader-disconnected.svg';
import DiscountRegSvg       from '../../../assets/icons/register icons/discount.svg';
// @ts-ignore
import SearchBtnSvg         from '../../../assets/icons/register icons/Search Button.svg';

// ─── Launcher app icons ───────────────────────────────────────────────────────
import GodaddyGoSvg        from '../../../assets/icons/Launcher icons/GD_TheGo.svg';
import LauncherTxSvg       from '../../../assets/icons/Launcher icons/transactions.svg';
import LauncherSettSvg     from '../../../assets/icons/Launcher icons/settlements.svg';
import LauncherProdSvg     from '../../../assets/icons/Launcher icons/products.svg';
import LauncherOrdersSvg   from '../../../assets/icons/Launcher icons/orders-redrawn.svg';
import LauncherRegisterSvg from '../../../assets/icons/Launcher icons/point-of-sale.svg';
import LauncherStSvg       from '../../../assets/icons/Launcher icons/smart-terminal.svg';

// ─── Misc / branding ─────────────────────────────────────────────────────────
import GdGlyphSvg    from '../../../assets/icons/Glyph.svg';
import UserHeartSvg  from '../../../assets/icons/User-heart.svg';
import Vector1Svg    from '../../../assets/icons/Vector-1.svg';
import Vector2Svg    from '../../../assets/icons/Vector-2.svg';
import VectorSvg     from '../../../assets/icons/Vector.svg';
// @ts-ignore
import CatalogAltSvg from '../../../assets/icons/catalog 2.svg';
// @ts-ignore
import CtaButtonSvg  from '../../../assets/icons/CTA Button.svg';

// ─── Color swatch variants ────────────────────────────────────────────────────
import ColorSvg   from '../../../assets/icons/Color.svg';
import Color1Svg  from '../../../assets/icons/Color-1.svg';
import Color2Svg  from '../../../assets/icons/Color-2.svg';
import Color3Svg  from '../../../assets/icons/Color-3.svg';
import Color4Svg  from '../../../assets/icons/Color-4.svg';
import Color5Svg  from '../../../assets/icons/Color-5.svg';
import Color6Svg  from '../../../assets/icons/Color-6.svg';
import Color7Svg  from '../../../assets/icons/Color-7.svg';
import Color8Svg  from '../../../assets/icons/Color-8.svg';
import Color9Svg  from '../../../assets/icons/Color-9.svg';
import Color10Svg from '../../../assets/icons/Color-10.svg';
import Color11Svg from '../../../assets/icons/Color-11.svg';
import Color12Svg from '../../../assets/icons/Color-12.svg';
import Color13Svg from '../../../assets/icons/Color-13.svg';
import Color14Svg from '../../../assets/icons/Color-14.svg';
import Color15Svg from '../../../assets/icons/Color-15.svg';
import Color16Svg from '../../../assets/icons/Color-16.svg';
import Color17Svg from '../../../assets/icons/Color-17.svg';
import Color18Svg from '../../../assets/icons/Color-18.svg';
import Color19Svg from '../../../assets/icons/Color-19.svg';
import Color20Svg from '../../../assets/icons/Color-20.svg';
import Color21Svg from '../../../assets/icons/Color-21.svg';
import Color22Svg from '../../../assets/icons/Color-22.svg';
import Color23Svg from '../../../assets/icons/Color-23.svg';
import Color24Svg from '../../../assets/icons/Color-24.svg';
import Color25Svg from '../../../assets/icons/Color-25.svg';
import Color26Svg from '../../../assets/icons/Color-26.svg';
import Color27Svg from '../../../assets/icons/Color-27.svg';
import Color28Svg from '../../../assets/icons/Color-28.svg';
import Color29Svg from '../../../assets/icons/Color-29.svg';
import Color30Svg from '../../../assets/icons/Color-30.svg';

// ─── General UI library — 339 clean root icons ───────────────────────────────
import AccessibilitySvg    from '../../../assets/icons/accessibility.svg';
import AddAppSvg           from '../../../assets/icons/add-app.svg';
import AddToCartSvg        from '../../../assets/icons/add-to-cart.svg';
import AddSvg              from '../../../assets/icons/add.svg';
import AddonSvg            from '../../../assets/icons/addon.svg';
import AlbumContactsSvg    from '../../../assets/icons/album-contacts.svg';
import AlertSvg            from '../../../assets/icons/alert.svg';
import AlignCenterSvg      from '../../../assets/icons/align-center.svg';
import AlignJustifySvg     from '../../../assets/icons/align-justify.svg';
import AlignLeftSvg        from '../../../assets/icons/align-left.svg';
import AlignRightSvg       from '../../../assets/icons/align-right.svg';
import AllPaytoolsSvg      from '../../../assets/icons/all-paytools.svg';
import AllSalesChannelsSvg from '../../../assets/icons/all-saleschannels.svg';
import AppointmentsSvg     from '../../../assets/icons/appointments.svg';
import AppsSvg             from '../../../assets/icons/apps.svg';
import Apps2Svg            from '../../../assets/icons/apps2.svg';
import ArchiveSvg          from '../../../assets/icons/archive.svg';
import ArrowDownSvg        from '../../../assets/icons/arrow-down.svg';
import ArrowLeftSvg        from '../../../assets/icons/arrow-left.svg';
import ArrowRightSvg       from '../../../assets/icons/arrow-right.svg';
import ArrowUpSvg          from '../../../assets/icons/arrow-up.svg';
import ArrowsCircleSvg     from '../../../assets/icons/arrows-circle.svg';
import AtSvg               from '../../../assets/icons/at.svg';
import AttachmentSvg       from '../../../assets/icons/attachment.svg';
import AuctionSvg          from '../../../assets/icons/auction.svg';
import BackspaceSvg        from '../../../assets/icons/backspace.svg';
import BackwardSvg         from '../../../assets/icons/backward.svg';
import BagFavoriteSvg      from '../../../assets/icons/bag-favorite.svg';
import BagSvg              from '../../../assets/icons/bag.svg';
import BarGraphSvg         from '../../../assets/icons/bar-graph.svg';
import BarcodeSvg          from '../../../assets/icons/barcode.svg';
import BellSvg             from '../../../assets/icons/bell.svg';
import BenefitsSvg         from '../../../assets/icons/benefits.svg';
import BinocularsSvg       from '../../../assets/icons/binoculars.svg';
import BlogSvg             from '../../../assets/icons/blog.svg';
import BluetoothSvg        from '../../../assets/icons/bluetooth.svg';
import BoldSvg             from '../../../assets/icons/bold.svg';
import BookmarkSvg         from '../../../assets/icons/bookmark.svg';
import BriefcaseSvg        from '../../../assets/icons/briefcase.svg';
import BulkSearchSvg       from '../../../assets/icons/bulk-search.svg';
import BulletedListSvg     from '../../../assets/icons/bulleted-list.svg';
import BullseyeSvg         from '../../../assets/icons/bullseye.svg';
import CalculatorSvg       from '../../../assets/icons/calculator.svg';
import KeypadSvg           from '../../../assets/icons/keypad.svg';
import CalendarSvg         from '../../../assets/icons/calendar.svg';
import CameraSvg           from '../../../assets/icons/camera.svg';
import CartSvg             from '../../../assets/icons/cart.svg';
import ChatSvg             from '../../../assets/icons/chat.svg';
import CheckboxListSvg     from '../../../assets/icons/checkbox-list.svg';
import CheckboxSvg         from '../../../assets/icons/checkbox.svg';
import CheckmarkSvg        from '../../../assets/icons/checkmark.svg';
import ChevronDblLeftSvg   from '../../../assets/icons/chevron-dbl-left.svg';
import ChevronDblRightSvg  from '../../../assets/icons/chevron-dbl-right.svg';
import ChevronDownSvg      from '../../../assets/icons/chevron-down.svg';
import ChevronLeftSvg      from '../../../assets/icons/chevron-left.svg';
import ChevronRightSvg     from '../../../assets/icons/chevron-right.svg';
import ChevronUpSvg        from '../../../assets/icons/chevron-up.svg';
import CircleSvg           from '../../../assets/icons/circle.svg';
import ClearFormattingSvg  from '../../../assets/icons/clear-formatting.svg';
import ClickSvg            from '../../../assets/icons/click.svg';
import ClipboardSvg        from '../../../assets/icons/clipboard.svg';
import ClockSvg            from '../../../assets/icons/clock.svg';
import CloudSvg            from '../../../assets/icons/cloud.svg';
import CodeSvg             from '../../../assets/icons/code.svg';
import ColorPaletteSvg     from '../../../assets/icons/color-palette.svg';
import ColumnsSvg          from '../../../assets/icons/columns.svg';
import CommentSvg          from '../../../assets/icons/comment.svg';
import CommentsSvg         from '../../../assets/icons/comments.svg';
import ContentSvg          from '../../../assets/icons/content.svg';
import ConversationsSvg    from '../../../assets/icons/conversations.svg';
import CopySvg             from '../../../assets/icons/copy.svg';
import CreateButtonSvg     from '../../../assets/icons/create-button.svg';
import CreateContentSvg    from '../../../assets/icons/create-content.svg';
import CreateFormSvg       from '../../../assets/icons/create-form.svg';
import CreateNavSvg        from '../../../assets/icons/create-nav.svg';
import CreditCardSvg       from '../../../assets/icons/credit-card.svg';
import CropSvg             from '../../../assets/icons/crop.svg';
import CrosshairSvg        from '../../../assets/icons/crosshair.svg';
import CurrencySvg         from '../../../assets/icons/currency.svg';
import CutSvg              from '../../../assets/icons/cut.svg';
import DashboardSvg        from '../../../assets/icons/dashboard.svg';
import DatabaseNetworkSvg  from '../../../assets/icons/database-network.svg';
import DatabaseSvg         from '../../../assets/icons/database.svg';
import DeleteSvg           from '../../../assets/icons/delete.svg';
import DesktopSvg          from '../../../assets/icons/desktop.svg';
import DiamondSvg          from '../../../assets/icons/diamond.svg';
import DiscountSvg         from '../../../assets/icons/discount.svg';
import DivideSvg           from '../../../assets/icons/divide.svg';
import DollarSvg           from '../../../assets/icons/dollar.svg';
import DomainSvg           from '../../../assets/icons/domain.svg';
import DonateSvg           from '../../../assets/icons/donate.svg';
import DownloadSvg         from '../../../assets/icons/download.svg';
import DriveSvg            from '../../../assets/icons/drive.svg';
import DropdownMenuSvg     from '../../../assets/icons/dropdown-menu.svg';
import EditWebsiteSvg      from '../../../assets/icons/edit-website.svg';
import EditSvg             from '../../../assets/icons/edit.svg';
import EditorLargerSvg     from '../../../assets/icons/editor-larger.svg';
import EditorSmallerSvg    from '../../../assets/icons/editor-smaller.svg';
import EjectSvg            from '../../../assets/icons/eject.svg';
import EllipsisSvg         from '../../../assets/icons/ellipsis.svg';
import EmailSvg            from '../../../assets/icons/email.svg';
import EuroSvg             from '../../../assets/icons/euro.svg';
import ExchangeSvg         from '../../../assets/icons/exchange.svg';
import ExperimentSvg       from '../../../assets/icons/experiment.svg';
import EyeDropperSvg       from '../../../assets/icons/eye-dropper.svg';
import EyeDropper1Svg      from '../../../assets/icons/eye-dropper-1.svg';
import FaqsSvg             from '../../../assets/icons/faqs.svg';
import FastBackwardSvg     from '../../../assets/icons/fast-backward.svg';
import FastForward1Svg     from '../../../assets/icons/fast-forward-1.svg';
import FastForwardSvg      from '../../../assets/icons/fast-forward.svg';
import FeatureSvg          from '../../../assets/icons/feature.svg';
import FilterSvg           from '../../../assets/icons/filter.svg';
import FingerprintSvg      from '../../../assets/icons/fingerprint.svg';
import FireSvg             from '../../../assets/icons/fire.svg';
import FlagSvg             from '../../../assets/icons/flag.svg';
import FlatrateSvg         from '../../../assets/icons/flatrate.svg';
import FolderAddSvg        from '../../../assets/icons/folder-add.svg';
import FolderMinusSvg      from '../../../assets/icons/folder-minus.svg';
import FolderNetworkSvg    from '../../../assets/icons/folder-network.svg';
import FolderOpenSvg       from '../../../assets/icons/folder-open.svg';
import FolderSvg           from '../../../assets/icons/folder.svg';
import FontsPairingSvg     from '../../../assets/icons/fonts-pairing.svg';
import FoodSvg             from '../../../assets/icons/food.svg';
import ForwardSvg          from '../../../assets/icons/forward.svg';
import GallerySvg          from '../../../assets/icons/gallery.svg';
import GdLogoIconSvg       from '../../../assets/icons/gd-logo-icon.svg';
import GiftSvg             from '../../../assets/icons/gift.svg';
import GrabVertSvg         from '../../../assets/icons/grab-vert.svg';
import GraphSvg            from '../../../assets/icons/graph.svg';
import GridSvg             from '../../../assets/icons/grid.svg';
import GroupSvg            from '../../../assets/icons/users2.svg';
import HamburgerSvg        from '../../../assets/icons/hamburger.svg';
import HandicapSvg         from '../../../assets/icons/handicap.svg';
import HeartSvg            from '../../../assets/icons/heart.svg';
import HelpSvg             from '../../../assets/icons/help.svg';
import HideSvg             from '../../../assets/icons/hide.svg';
import HistorySvg          from '../../../assets/icons/history.svg';
import HomeSvg             from '../../../assets/icons/home.svg';
import HorizontalSpacingSvg from '../../../assets/icons/horizontal-spacing.svg';
import ImageGallerySvg     from '../../../assets/icons/image-gallery.svg';
import ImageSvg            from '../../../assets/icons/image.svg';
import InPersonSvg         from '../../../assets/icons/in-person.svg';
import InboxFullSvg        from '../../../assets/icons/inbox-full.svg';
import InboxSvg            from '../../../assets/icons/inbox.svg';
import IndentLeftSvg       from '../../../assets/icons/indent-left.svg';
import InformationSvg      from '../../../assets/icons/information.svg';
import InlineEditSvg       from '../../../assets/icons/inline-edit.svg';
import IntroSvg            from '../../../assets/icons/intro.svg';
import InvoiceSvg          from '../../../assets/icons/invoice.svg';
import InvoicesSvg         from '../../../assets/icons/invoices.svg';
import IssueRefundSvg      from '../../../assets/icons/issue-refund.svg';
import ItalicSvg           from '../../../assets/icons/italic.svg';
import ItemsAlignCenterSvg from '../../../assets/icons/items-align-center.svg';
import ItemsAlignLeftSvg   from '../../../assets/icons/items-align-left.svg';
import LayersSvg           from '../../../assets/icons/layers.svg';
import LayoutSvg           from '../../../assets/icons/layout.svg';
import LeafSvg             from '../../../assets/icons/leaf.svg';
import LightbulbSvg        from '../../../assets/icons/lightbulb.svg';
import LightningBoltSvg    from '../../../assets/icons/lightning-bolt.svg';
import LinkArrowSvg        from '../../../assets/icons/link-arrow.svg';
import LinkSvg             from '../../../assets/icons/link.svg';
import ListSvg             from '../../../assets/icons/bulleted-list.svg';
import LocationSvg         from '../../../assets/icons/location.svg';
import LockedSvg           from '../../../assets/icons/locked.svg';
import LogoutSvg           from '../../../assets/icons/logout.svg';
import MailAddSvg          from '../../../assets/icons/mail-add.svg';
import MailLockSvg         from '../../../assets/icons/mail-lock.svg';
import MailOpenSvg         from '../../../assets/icons/mail-open.svg';
import MailSvg             from '../../../assets/icons/mail.svg';
import ManageProductsSvg   from '../../../assets/icons/manage-products.svg';
import ManageReviewsSvg    from '../../../assets/icons/manage-reviews.svg';
import ManageServicesSvg   from '../../../assets/icons/manage-services.svg';
import MapPinSvg           from '../../../assets/icons/map-pin.svg';
import MapSvg              from '../../../assets/icons/map.svg';
import MarketingSvg        from '../../../assets/icons/marketing.svg';
import MarketplacesSvg     from '../../../assets/icons/marketplaces.svg';
import MediaSvg            from '../../../assets/icons/media.svg';
import MegaphoneSvg        from '../../../assets/icons/megaphone.svg';
import MenuSvg             from '../../../assets/icons/menu.svg';
import MicSvg              from '../../../assets/icons/mic.svg';
import MinusSvg            from '../../../assets/icons/minus.svg';
import MobilePhoneSvg      from '../../../assets/icons/mobile-phone.svg';
import MoonSvg             from '../../../assets/icons/moon.svg';
import NetworkSvg          from '../../../assets/icons/network.svg';
import NfcSvg              from '../../../assets/icons/nfc.svg';
import NoSvg               from '../../../assets/icons/no.svg';
import NumberedListSvg     from '../../../assets/icons/numbered-list.svg';
import OkSvg               from '../../../assets/icons/ok.svg';
import OnlineOrderingSvg   from '../../../assets/icons/online-ordering.svg';
import OnlineStoreSvg      from '../../../assets/icons/online-store.svg';
import OrdersSvg           from '../../../assets/icons/orders.svg';
import PageSvg             from '../../../assets/icons/page.svg';
import PagesSvg            from '../../../assets/icons/pages.svg';
import PaintBucketSvg      from '../../../assets/icons/paint-bucket.svg';
import PaintbrushSvg       from '../../../assets/icons/paintbrush.svg';
import PauseSvg            from '../../../assets/icons/pause.svg';
import PayLinksWalletSvg   from '../../../assets/icons/pay-links-wallet.svg';
import PayLinksSvg         from '../../../assets/icons/pay-links.svg';
import PayoutsSvg          from '../../../assets/icons/payouts.svg';
import PercentSvg          from '../../../assets/icons/percent.svg';
import PhoneSvg            from '../../../assets/icons/phone.svg';
import PinSvg              from '../../../assets/icons/pin.svg';
import PlaySvg             from '../../../assets/icons/play.svg';
import PlusSvg             from '../../../assets/icons/plus.svg';
import PoundSvg            from '../../../assets/icons/pound.svg';
import PrintSvg            from '../../../assets/icons/print.svg';
import PrintUnavSvg        from '../../../assets/icons/print_unavailable.svg';
import PrintUnavBSvg       from '../../../assets/icons/print_unavailable_b.svg';
import PrivacySvg          from '../../../assets/icons/privacy.svg';
import ProductsSvg         from '../../../assets/icons/products.svg';
import QrcodeSvg           from '../../../assets/icons/qrcode.svg';
import QuoteSvg            from '../../../assets/icons/quote.svg';
import RandomSvg           from '../../../assets/icons/random.svg';
import ReceiptSvg          from '../../../assets/icons/receipt.svg';
import ReceiptOkSvg        from '../../../assets/icons/reciept-ok.svg';
import RedoSvg             from '../../../assets/icons/redo.svg';
import RefreshOffSvg       from '../../../assets/icons/refresh-off.svg';
import RefreshSvg          from '../../../assets/icons/refresh.svg';
import RemoveSvg           from '../../../assets/icons/remove.svg';
import ReplyAllSvg         from '../../../assets/icons/reply-all.svg';
import ReplySvg            from '../../../assets/icons/reply.svg';
import ReportsBoardSvg     from '../../../assets/icons/reports-board.svg';
import ReportsSvg          from '../../../assets/icons/reports.svg';
import RetweetSvg          from '../../../assets/icons/retweet.svg';
import RevertSvg           from '../../../assets/icons/revert.svg';
import SafetySvg           from '../../../assets/icons/safety.svg';
import SaveSvg             from '../../../assets/icons/save.svg';
import ScannerSvg          from '../../../assets/icons/scanner.svg';
import SearchSvg           from '../../../assets/icons/search.svg';
import SelectSvg           from '../../../assets/icons/select.svg';
import SellingTipsSvg      from '../../../assets/icons/selling-tips.svg';
import SendSvg             from '../../../assets/icons/send.svg';
import ServerSvg           from '../../../assets/icons/server.svg';
import ServiceBellSvg      from '../../../assets/icons/service-bell.svg';
import SettingsSvg         from '../../../assets/icons/settings.svg';
import SettlementsSvg      from '../../../assets/icons/settlements.svg';
import ShareSvg            from '../../../assets/icons/share.svg';
import ShieldCheckSvg      from '../../../assets/icons/shield-check.svg';
import ShieldSvg           from '../../../assets/icons/shield.svg';
import ShippingScaleSvg    from '../../../assets/icons/shipping-scale.svg';
import ShippingSvg         from '../../../assets/icons/shipping.svg';
import ShowSvg             from '../../../assets/icons/show.svg';
import SidebarCollapseSvg  from '../../../assets/icons/sidebar-collapse.svg';
import SidebarExpandSvg    from '../../../assets/icons/sidebar-expand.svg';
import SlidersSvg          from '../../../assets/icons/sliders.svg';
import SmartTerminalSvg    from '../../../assets/icons/smart-terminal.svg';
import SocialSvg           from '../../../assets/icons/social.svg';
import SpacingColSvg       from '../../../assets/icons/spacing-col.svg';
import SpacingSvg          from '../../../assets/icons/spacing.svg';
import SparklesSvg         from '../../../assets/icons/sparkles.svg';
import SpeedometerSvg      from '../../../assets/icons/speedometer.svg';
import StarSvg             from '../../../assets/icons/star.svg';
import StepBackwardSvg     from '../../../assets/icons/step-backward.svg';
import StepForwardSvg      from '../../../assets/icons/step-forward.svg';
import StopSvg             from '../../../assets/icons/stop.svg';
import StrikeThroughSvg    from '../../../assets/icons/strike-through.svg';
import StylesSvg           from '../../../assets/icons/styles.svg';
import SubscriptSvg        from '../../../assets/icons/subscript.svg';
import SunSvg              from '../../../assets/icons/sun.svg';
import SuperscriptSvg      from '../../../assets/icons/superscript.svg';
import TableSvg            from '../../../assets/icons/table.svg';
import TabletSvg           from '../../../assets/icons/tablet.svg';
import TabsSvg             from '../../../assets/icons/tabs.svg';
import TagSvg              from '../../../assets/icons/tag.svg';
import TakePaymentSvg      from '../../../assets/icons/take-payment.svg';
import TerminalSvg         from '../../../assets/icons/terminal.svg';
import TextHighlightSvg    from '../../../assets/icons/text-highlight.svg';
import ThumbsDownSvg       from '../../../assets/icons/thumbs-down.svg';
import ThumbsUpSvg         from '../../../assets/icons/thumbs-up.svg';
import TransactionsMonSvg  from '../../../assets/icons/transactions-money.svg';
import TransactionsSvg     from '../../../assets/icons/transactions.svg';
import TrashSvg            from '../../../assets/icons/trash.svg';
import TruckSvg            from '../../../assets/icons/truck.svg';
import UmbrellaSvg         from '../../../assets/icons/umbrella.svg';
import UnderlineSvg        from '../../../assets/icons/underline.svg';
import UndoSvg             from '../../../assets/icons/undo.svg';
import UnlinkSvg           from '../../../assets/icons/unlink.svg';
import UnlockedSvg         from '../../../assets/icons/unlocked.svg';
import UpgradeSvg          from '../../../assets/icons/upgrade.svg';
import UploadSvg           from '../../../assets/icons/upload.svg';
import UserAddSvg          from '../../../assets/icons/user-add.svg';
import UserCircleSvg       from '../../../assets/icons/user-circle.svg';
import UserDeleteSvg       from '../../../assets/icons/user-delete.svg';
import UserLockedSvg       from '../../../assets/icons/user-locked.svg';
import UserRemoveSvg       from '../../../assets/icons/user-remove.svg';
import UserUnlockedSvg     from '../../../assets/icons/user-unlocked.svg';
import UserWavingSvg       from '../../../assets/icons/user-waving.svg';
import UserSvg             from '../../../assets/icons/user.svg';
import Users2Svg           from '../../../assets/icons/users2.svg';
import Users3Svg           from '../../../assets/icons/users3.svg';
import VerticalSpacingSvg  from '../../../assets/icons/vertical-spacing.svg';
import VideoCameraSvg      from '../../../assets/icons/video-camera.svg';
import VideoSvg            from '../../../assets/icons/video.svg';
import ViewReportsSvg      from '../../../assets/icons/view-reports.svg';
import VirtualTerminalSvg  from '../../../assets/icons/virtual-terminal.svg';
import VoicemailSvg        from '../../../assets/icons/voicemail.svg';
import VolumeDownSvg       from '../../../assets/icons/volume-down.svg';
import VolumeMuteSvg       from '../../../assets/icons/volume-mute.svg';
import VolumeUpSvg         from '../../../assets/icons/volume-up.svg';
import WandSvg             from '../../../assets/icons/wand.svg';
import WebsiteSvg          from '../../../assets/icons/website.svg';
import WeightSvg           from '../../../assets/icons/weight.svg';
import WiFiSvg             from '../../../assets/icons/wi-fi.svg';
import WindowNewSvg        from '../../../assets/icons/window-new.svg';
import WorldSvg            from '../../../assets/icons/world.svg';
import XSvg                from '../../../assets/icons/x.svg';

// ─── Icon name type ───────────────────────────────────────────────────────────

export type IconName =
  // Navigation
  | 'nav-back' | 'nav-home' | 'nav-recent'
  // Payment types
  | 'payment-credit-card' | 'payment-cash' | 'payment-wallet' | 'payment-loyalty'
  | 'payment-ebt' | 'payment-qr' | 'payment-other' | 'payment-multi-tender'
  | 'payment-fingerprint'
  // 24px subfolder set
  | 'register-24' | 'drawer' | 'dollar-24' | 'discount-24' | 'user-add-24'
  | 'save-24' | 'check-filled' | 'draw-24' | 'barcode-24'
  // Card reader states
  | 'card-reader' | 'card-reader-disconnected' | 'card-reader-charging'
  | 'card-reader-10' | 'card-reader-25' | 'card-reader-50'
  | 'card-reader-75' | 'card-reader-100'
  | 'card-reader-sell-mode' | 'card-reader-sell-mode-32'
  // Payment / transaction 24px
  | 'ttp' | 'ttp-filled' | 'bank-24' | 'transaction-24' | 'transaction-filled-24'
  | 'card-transaction-24' | 'tag-24' | 'tag-filled-24'
  // Hardware status 32px
  | 'contactless-32' | 'contactless-filled-32' | 'phone-error' | 'bluetooth-error'
  | 'device-warning' | 'network-error' | 'lcr-error' | 'scanner-32'
  | 'cash-payment-32' | 'card-payment-32' | 'poynt-card-payment' | 'card-bank' | 'cash' | 'ebt'
  // Large 60px
  | 'layers-60' | 'invoice-60' | 'bank-lg' | 'circle-help' | 'list-60'
  | 'register-lg' | 'apps-60' | 'catalog-60' | 'transaction-lg' | 'manual-entry'
  | 'receipt-60' | 'orders-60' | 'card-transaction-lg'
  // Register filled set
  | 'ok-filled' | 'dollar-filled' | 'barcode-filled' | 'barcode-alt'
  | 'arrow-up-reg' | 'user-add-filled' | 'info-reg' | 'search-reg' | 'draw-filled'
  | 'point-of-sale' | 'card-reader-disconnected-filled' | 'discount-reg'
  // Launcher app icons
  | 'godaddy-go' | 'launcher-transactions' | 'launcher-settlements'
  | 'launcher-products' | 'launcher-orders' | 'launcher-register'
  | 'launcher-smart-terminal'
  // Misc / branding
  | 'gd-glyph' | 'user-heart' | 'vector' | 'vector-1' | 'vector-2'
  | 'catalog-alt' | 'cta-button'
  | 'print-unavailable' | 'print-unavailable-b'
  // Color swatches
  | 'color' | 'color-1' | 'color-2' | 'color-3' | 'color-4' | 'color-5'
  | 'color-6' | 'color-7' | 'color-8' | 'color-9' | 'color-10'
  | 'color-11' | 'color-12' | 'color-13' | 'color-14' | 'color-15'
  | 'color-16' | 'color-17' | 'color-18' | 'color-19' | 'color-20'
  | 'color-21' | 'color-22' | 'color-23' | 'color-24' | 'color-25'
  | 'color-26' | 'color-27' | 'color-28' | 'color-29' | 'color-30'
  // ─── General UI library ──────────────────────────────────────────────────
  | 'accessibility' | 'add-app' | 'add-to-cart' | 'add' | 'addon'
  | 'album-contacts' | 'alert' | 'align-center' | 'align-justify' | 'align-left'
  | 'align-right' | 'all-paytools' | 'all-saleschannels' | 'appointments'
  | 'apps' | 'apps2' | 'archive' | 'arrow-down' | 'arrow-left' | 'arrow-right'
  | 'arrow-up' | 'arrows-circle' | 'at' | 'attachment' | 'auction' | 'backspace'
  | 'backward' | 'bag-favorite' | 'bag' | 'bar-graph' | 'barcode' | 'bell'
  | 'benefits' | 'binoculars' | 'blog' | 'bluetooth' | 'bold' | 'bookmark'
  | 'briefcase' | 'bulk-search' | 'bulleted-list' | 'bullseye' | 'calculator'
  | 'calendar' | 'camera' | 'cart' | 'chat' | 'checkbox-list' | 'checkbox'
  | 'checkmark' | 'chevron-dbl-left' | 'chevron-dbl-right' | 'chevron-down'
  | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'circle'
  | 'clear-formatting' | 'click' | 'clipboard' | 'clock' | 'cloud' | 'code'
  | 'color-palette' | 'columns' | 'comment' | 'comments' | 'content'
  | 'conversations' | 'copy' | 'create-button' | 'create-content' | 'create-form'
  | 'create-nav' | 'credit-card' | 'crop' | 'crosshair' | 'currency' | 'cut'
  | 'dashboard' | 'database-network' | 'database' | 'delete' | 'desktop'
  | 'diamond' | 'discount' | 'divide' | 'dollar' | 'domain' | 'donate'
  | 'download' | 'drive' | 'dropdown-menu' | 'edit-website' | 'edit'
  | 'editor-larger' | 'editor-smaller' | 'eject' | 'ellipsis' | 'email'
  | 'euro' | 'exchange' | 'experiment' | 'eye-dropper' | 'eye-dropper-1'
  | 'faqs' | 'fast-backward' | 'fast-forward-1' | 'fast-forward' | 'feature'
  | 'filter' | 'fingerprint' | 'fire' | 'flag' | 'flatrate' | 'folder-add'
  | 'folder-minus' | 'folder-network' | 'folder-open' | 'folder'
  | 'fonts-pairing' | 'food' | 'forward' | 'gallery' | 'gd-logo-icon' | 'gift'
  | 'grab-vert' | 'graph' | 'grid' | 'group' | 'hamburger' | 'handicap'
  | 'heart' | 'help' | 'hide' | 'history' | 'home' | 'horizontal-spacing'
  | 'image-gallery' | 'image' | 'in-person' | 'inbox-full' | 'inbox'
  | 'indent-left' | 'information' | 'inline-edit' | 'intro' | 'invoice'
  | 'invoices' | 'issue-refund' | 'italic' | 'items-align-center'
  | 'items-align-left' | 'layers' | 'layout' | 'leaf' | 'lightbulb'
  | 'lightning-bolt' | 'link-arrow' | 'link' | 'list' | 'location' | 'locked'
  | 'logout' | 'mail-add' | 'mail-lock' | 'mail-open' | 'mail'
  | 'manage-products' | 'manage-reviews' | 'manage-services' | 'map-pin' | 'map'
  | 'marketing' | 'marketplaces' | 'media' | 'megaphone' | 'menu' | 'mic'
  | 'minus' | 'mobile-phone' | 'moon' | 'network' | 'nfc' | 'no' | 'numbered-list'
  | 'keypad'
  | 'ok' | 'online-ordering' | 'online-store' | 'orders' | 'page' | 'pages'
  | 'paint-bucket' | 'paintbrush' | 'pause' | 'pay-links-wallet' | 'pay-links'
  | 'payouts' | 'percent' | 'phone' | 'pin' | 'play' | 'plus' | 'pound'
  | 'print' | 'privacy' | 'products' | 'qrcode' | 'quote' | 'random'
  | 'receipt' | 'receipt-ok' | 'redo' | 'refresh-off' | 'refresh' | 'remove'
  | 'reply-all' | 'reply' | 'reports-board' | 'reports' | 'retweet' | 'revert'
  | 'safety' | 'save' | 'scanner' | 'search' | 'select' | 'selling-tips'
  | 'send' | 'server' | 'service-bell' | 'settings' | 'settlements' | 'share'
  | 'shield-check' | 'shield' | 'shipping-scale' | 'shipping' | 'show'
  | 'sidebar-collapse' | 'sidebar-expand' | 'sliders' | 'smart-terminal'
  | 'social' | 'spacing-col' | 'spacing' | 'sparkles' | 'speedometer' | 'star'
  | 'step-backward' | 'step-forward' | 'stop' | 'strike-through' | 'styles'
  | 'subscript' | 'sun' | 'superscript' | 'table' | 'tablet' | 'tabs' | 'tag'
  | 'take-payment' | 'terminal' | 'text-highlight' | 'thumbs-down' | 'thumbs-up'
  | 'transactions-money' | 'transactions' | 'trash' | 'truck' | 'umbrella'
  | 'underline' | 'undo' | 'unlink' | 'unlocked' | 'upgrade' | 'upload'
  | 'user-add' | 'user-circle' | 'user-delete' | 'user-locked' | 'user-remove'
  | 'user-unlocked' | 'user-waving' | 'user' | 'users2' | 'users3'
  | 'vertical-spacing' | 'video-camera' | 'video' | 'view-reports'
  | 'virtual-terminal' | 'voicemail' | 'volume-down' | 'volume-mute' | 'volume-up'
  | 'wand' | 'website' | 'weight' | 'wi-fi' | 'window-new' | 'world' | 'x';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<IconName, SvgC> = {
  // Navigation
  'nav-back': NavBackSvg, 'nav-home': NavHomeSvg, 'nav-recent': NavRecentSvg,
  // Payment types
  'payment-credit-card': PaymentCreditCardSvg, 'payment-cash': PaymentCashSvg,
  'payment-wallet': PaymentWalletSvg, 'payment-loyalty': PaymentLoyaltySvg,
  'payment-ebt': PaymentEbtSvg, 'payment-qr': PaymentQrSvg,
  'payment-other': PaymentOtherSvg, 'payment-multi-tender': PaymentMultiTenderSvg,
  'payment-fingerprint': PaymentFingerprintSvg,
  // 24px subfolder set
  'register-24': Register24Svg, drawer: Drawer24Svg, 'dollar-24': Dollar24Svg,
  'discount-24': Discount24Svg, 'user-add-24': UserAdd24Svg, 'save-24': Save24Svg,
  'check-filled': CheckFilled24Svg, 'draw-24': Draw24Svg, 'barcode-24': Barcode24Svg,
  // Card reader states
  'card-reader': CardReaderSvg, 'card-reader-disconnected': CardReaderDiscSvg,
  'card-reader-charging': CardReaderChargingSvg, 'card-reader-10': CardReaderBat10Svg,
  'card-reader-25': CardReaderBat25Svg, 'card-reader-50': CardReaderBat50Svg,
  'card-reader-75': CardReaderBat75Svg, 'card-reader-100': CardReaderBat100Svg,
  'card-reader-sell-mode': CardReaderSellMode24Svg,
  'card-reader-sell-mode-32': CardReaderSellMode32Svg,
  // Payment / transaction 24px
  ttp: TtpSvg, 'ttp-filled': TtpFilledSvg, 'bank-24': Bank24Svg,
  'transaction-24': Transaction24Svg, 'transaction-filled-24': TransactionFil24Svg,
  'card-transaction-24': CardTx24Svg, 'tag-24': Tag24Svg, 'tag-filled-24': TagFilled24Svg,
  // Hardware status 32px
  'contactless-32': Contactless32Svg, 'contactless-filled-32': ContactlessFill32Svg,
  'phone-error': PhoneError32Svg, 'bluetooth-error': BluetoothError32Svg,
  'device-warning': DeviceWarning32Svg, 'network-error': NetworkError32Svg,
  'lcr-error': LcrError32Svg, 'scanner-32': Scanner32Svg,
  'cash-payment-32': CashPayment32Svg, 'card-payment-32': CardPayment32Svg,
  'poynt-card-payment': PoyntCardPaymentSvg,
  'card-bank': CardBankSvg, 'cash': CashSvg, 'ebt': EbtSvg,
  // Large 60px
  'layers-60': Layers60Svg, 'invoice-60': Invoice60Svg, 'bank-lg': BankLg60Svg,
  'circle-help': CircleHelp60Svg, 'list-60': List60Svg, 'register-lg': RegisterLg60Svg,
  'apps-60': Apps60Svg, 'catalog-60': Catalog60Svg, 'transaction-lg': TxLg60Svg,
  'manual-entry': ManualEntry60Svg, 'receipt-60': Receipt60Svg,
  'orders-60': Orders60Svg, 'card-transaction-lg': CardTxLg60Svg,
  // Register filled set
  'ok-filled': OkFilledSvg, 'dollar-filled': DollarFilledSvg,
  'barcode-filled': BarcodeFilledSvg, 'barcode-alt': BarcodeAltSvg,
  'arrow-up-reg': ArrowUpRegSvg, 'user-add-filled': UserAddFilledSvg,
  'info-reg': InfoRegSvg, 'search-reg': SearchBtnSvg, 'draw-filled': DrawFilledSvg,
  'point-of-sale': PointOfSaleSvg,
  'card-reader-disconnected-filled': CardReaderDiscRegSvg,
  'discount-reg': DiscountRegSvg,
  // Launcher app icons
  'godaddy-go': GodaddyGoSvg, 'launcher-transactions': LauncherTxSvg,
  'launcher-settlements': LauncherSettSvg, 'launcher-products': LauncherProdSvg,
  'launcher-orders': LauncherOrdersSvg, 'launcher-register': LauncherRegisterSvg,
  'launcher-smart-terminal': LauncherStSvg,
  // Misc / branding
  'gd-glyph': GdGlyphSvg, 'user-heart': UserHeartSvg,
  vector: VectorSvg, 'vector-1': Vector1Svg, 'vector-2': Vector2Svg,
  'catalog-alt': CatalogAltSvg, 'cta-button': CtaButtonSvg,
  'print-unavailable': PrintUnavSvg, 'print-unavailable-b': PrintUnavBSvg,
  // Color swatches
  color: ColorSvg,
  'color-1': Color1Svg, 'color-2': Color2Svg, 'color-3': Color3Svg,
  'color-4': Color4Svg, 'color-5': Color5Svg, 'color-6': Color6Svg,
  'color-7': Color7Svg, 'color-8': Color8Svg, 'color-9': Color9Svg,
  'color-10': Color10Svg, 'color-11': Color11Svg, 'color-12': Color12Svg,
  'color-13': Color13Svg, 'color-14': Color14Svg, 'color-15': Color15Svg,
  'color-16': Color16Svg, 'color-17': Color17Svg, 'color-18': Color18Svg,
  'color-19': Color19Svg, 'color-20': Color20Svg, 'color-21': Color21Svg,
  'color-22': Color22Svg, 'color-23': Color23Svg, 'color-24': Color24Svg,
  'color-25': Color25Svg, 'color-26': Color26Svg, 'color-27': Color27Svg,
  'color-28': Color28Svg, 'color-29': Color29Svg, 'color-30': Color30Svg,
  // General UI library
  accessibility: AccessibilitySvg, 'add-app': AddAppSvg,
  'add-to-cart': AddToCartSvg, add: AddSvg, addon: AddonSvg,
  'album-contacts': AlbumContactsSvg, alert: AlertSvg,
  'align-center': AlignCenterSvg, 'align-justify': AlignJustifySvg,
  'align-left': AlignLeftSvg, 'align-right': AlignRightSvg,
  'all-paytools': AllPaytoolsSvg, 'all-saleschannels': AllSalesChannelsSvg,
  appointments: AppointmentsSvg, apps: AppsSvg, apps2: Apps2Svg,
  archive: ArchiveSvg, 'arrow-down': ArrowDownSvg, 'arrow-left': ArrowLeftSvg,
  'arrow-right': ArrowRightSvg, 'arrow-up': ArrowUpSvg,
  'arrows-circle': ArrowsCircleSvg, at: AtSvg, attachment: AttachmentSvg,
  auction: AuctionSvg, backspace: BackspaceSvg, backward: BackwardSvg,
  'bag-favorite': BagFavoriteSvg, bag: BagSvg, 'bar-graph': BarGraphSvg,
  barcode: BarcodeSvg, bell: BellSvg, benefits: BenefitsSvg,
  binoculars: BinocularsSvg, blog: BlogSvg, bluetooth: BluetoothSvg,
  bold: BoldSvg, bookmark: BookmarkSvg, briefcase: BriefcaseSvg,
  'bulk-search': BulkSearchSvg, 'bulleted-list': BulletedListSvg,
  bullseye: BullseyeSvg, calculator: CalculatorSvg, calendar: CalendarSvg, keypad: KeypadSvg,
  camera: CameraSvg, cart: CartSvg, chat: ChatSvg,
  'checkbox-list': CheckboxListSvg, checkbox: CheckboxSvg, checkmark: CheckmarkSvg,
  'chevron-dbl-left': ChevronDblLeftSvg, 'chevron-dbl-right': ChevronDblRightSvg,
  'chevron-down': ChevronDownSvg, 'chevron-left': ChevronLeftSvg,
  'chevron-right': ChevronRightSvg, 'chevron-up': ChevronUpSvg,
  circle: CircleSvg, 'clear-formatting': ClearFormattingSvg, click: ClickSvg,
  clipboard: ClipboardSvg, clock: ClockSvg, cloud: CloudSvg, code: CodeSvg,
  'color-palette': ColorPaletteSvg, columns: ColumnsSvg, comment: CommentSvg,
  comments: CommentsSvg, content: ContentSvg, conversations: ConversationsSvg,
  copy: CopySvg, 'create-button': CreateButtonSvg,
  'create-content': CreateContentSvg, 'create-form': CreateFormSvg,
  'create-nav': CreateNavSvg, 'credit-card': CreditCardSvg, crop: CropSvg,
  crosshair: CrosshairSvg, currency: CurrencySvg, cut: CutSvg,
  dashboard: DashboardSvg, 'database-network': DatabaseNetworkSvg,
  database: DatabaseSvg, delete: DeleteSvg, desktop: DesktopSvg,
  diamond: DiamondSvg, discount: DiscountSvg, divide: DivideSvg,
  dollar: DollarSvg, domain: DomainSvg, donate: DonateSvg,
  download: DownloadSvg, drive: DriveSvg, 'dropdown-menu': DropdownMenuSvg,
  'edit-website': EditWebsiteSvg, edit: EditSvg, 'editor-larger': EditorLargerSvg,
  'editor-smaller': EditorSmallerSvg, eject: EjectSvg, ellipsis: EllipsisSvg,
  email: EmailSvg, euro: EuroSvg, exchange: ExchangeSvg,
  experiment: ExperimentSvg, 'eye-dropper': EyeDropperSvg,
  'eye-dropper-1': EyeDropper1Svg, faqs: FaqsSvg, 'fast-backward': FastBackwardSvg,
  'fast-forward-1': FastForward1Svg, 'fast-forward': FastForwardSvg,
  feature: FeatureSvg, filter: FilterSvg, fingerprint: FingerprintSvg,
  fire: FireSvg, flag: FlagSvg, flatrate: FlatrateSvg,
  'folder-add': FolderAddSvg, 'folder-minus': FolderMinusSvg,
  'folder-network': FolderNetworkSvg, 'folder-open': FolderOpenSvg,
  folder: FolderSvg, 'fonts-pairing': FontsPairingSvg, food: FoodSvg,
  forward: ForwardSvg, gallery: GallerySvg, 'gd-logo-icon': GdLogoIconSvg,
  gift: GiftSvg, 'grab-vert': GrabVertSvg, graph: GraphSvg, grid: GridSvg,
  group: GroupSvg, hamburger: HamburgerSvg, handicap: HandicapSvg,
  heart: HeartSvg, help: HelpSvg, hide: HideSvg, history: HistorySvg,
  home: HomeSvg, 'horizontal-spacing': HorizontalSpacingSvg,
  'image-gallery': ImageGallerySvg, image: ImageSvg, 'in-person': InPersonSvg,
  'inbox-full': InboxFullSvg, inbox: InboxSvg, 'indent-left': IndentLeftSvg,
  information: InformationSvg, 'inline-edit': InlineEditSvg, intro: IntroSvg,
  invoice: InvoiceSvg, invoices: InvoicesSvg, 'issue-refund': IssueRefundSvg,
  italic: ItalicSvg, 'items-align-center': ItemsAlignCenterSvg,
  'items-align-left': ItemsAlignLeftSvg, layers: LayersSvg, layout: LayoutSvg,
  leaf: LeafSvg, lightbulb: LightbulbSvg, 'lightning-bolt': LightningBoltSvg,
  'link-arrow': LinkArrowSvg, link: LinkSvg, list: ListSvg,
  location: LocationSvg, locked: LockedSvg, logout: LogoutSvg,
  'mail-add': MailAddSvg, 'mail-lock': MailLockSvg, 'mail-open': MailOpenSvg,
  mail: MailSvg, 'manage-products': ManageProductsSvg,
  'manage-reviews': ManageReviewsSvg, 'manage-services': ManageServicesSvg,
  'map-pin': MapPinSvg, map: MapSvg, marketing: MarketingSvg,
  marketplaces: MarketplacesSvg, media: MediaSvg, megaphone: MegaphoneSvg,
  menu: MenuSvg, mic: MicSvg, minus: MinusSvg, 'mobile-phone': MobilePhoneSvg,
  moon: MoonSvg, network: NetworkSvg, nfc: NfcSvg, no: NoSvg, 'numbered-list': NumberedListSvg,
  ok: OkSvg, 'online-ordering': OnlineOrderingSvg, 'online-store': OnlineStoreSvg,
  orders: OrdersSvg, page: PageSvg, pages: PagesSvg,
  'paint-bucket': PaintBucketSvg, paintbrush: PaintbrushSvg, pause: PauseSvg,
  'pay-links-wallet': PayLinksWalletSvg, 'pay-links': PayLinksSvg,
  payouts: PayoutsSvg, percent: PercentSvg, phone: PhoneSvg, pin: PinSvg,
  play: PlaySvg, plus: PlusSvg, pound: PoundSvg, print: PrintSvg,
  privacy: PrivacySvg, products: ProductsSvg, qrcode: QrcodeSvg, quote: QuoteSvg,
  random: RandomSvg, receipt: ReceiptSvg, 'receipt-ok': ReceiptOkSvg,
  redo: RedoSvg, 'refresh-off': RefreshOffSvg, refresh: RefreshSvg,
  remove: RemoveSvg, 'reply-all': ReplyAllSvg, reply: ReplySvg,
  'reports-board': ReportsBoardSvg, reports: ReportsSvg, retweet: RetweetSvg,
  revert: RevertSvg, safety: SafetySvg, save: SaveSvg, scanner: ScannerSvg,
  search: SearchSvg, select: SelectSvg, 'selling-tips': SellingTipsSvg,
  send: SendSvg, server: ServerSvg, 'service-bell': ServiceBellSvg,
  settings: SettingsSvg, settlements: SettlementsSvg, share: ShareSvg,
  'shield-check': ShieldCheckSvg, shield: ShieldSvg,
  'shipping-scale': ShippingScaleSvg, shipping: ShippingSvg, show: ShowSvg,
  'sidebar-collapse': SidebarCollapseSvg, 'sidebar-expand': SidebarExpandSvg,
  sliders: SlidersSvg, 'smart-terminal': SmartTerminalSvg, social: SocialSvg,
  'spacing-col': SpacingColSvg, spacing: SpacingSvg, sparkles: SparklesSvg,
  speedometer: SpeedometerSvg, star: StarSvg, 'step-backward': StepBackwardSvg,
  'step-forward': StepForwardSvg, stop: StopSvg, 'strike-through': StrikeThroughSvg,
  styles: StylesSvg, subscript: SubscriptSvg, sun: SunSvg,
  superscript: SuperscriptSvg, table: TableSvg, tablet: TabletSvg, tabs: TabsSvg,
  tag: TagSvg, 'take-payment': TakePaymentSvg, terminal: TerminalSvg,
  'text-highlight': TextHighlightSvg, 'thumbs-down': ThumbsDownSvg,
  'thumbs-up': ThumbsUpSvg, 'transactions-money': TransactionsMonSvg,
  transactions: TransactionsSvg, trash: TrashSvg, truck: TruckSvg,
  umbrella: UmbrellaSvg, underline: UnderlineSvg, undo: UndoSvg,
  unlink: UnlinkSvg, unlocked: UnlockedSvg, upgrade: UpgradeSvg,
  upload: UploadSvg, 'user-add': UserAddSvg, 'user-circle': UserCircleSvg,
  'user-delete': UserDeleteSvg, 'user-locked': UserLockedSvg,
  'user-remove': UserRemoveSvg, 'user-unlocked': UserUnlockedSvg,
  'user-waving': UserWavingSvg, user: UserSvg, users2: Users2Svg,
  users3: Users3Svg, 'vertical-spacing': VerticalSpacingSvg,
  'video-camera': VideoCameraSvg, video: VideoSvg, 'view-reports': ViewReportsSvg,
  'virtual-terminal': VirtualTerminalSvg, voicemail: VoicemailSvg,
  'volume-down': VolumeDownSvg, 'volume-mute': VolumeMuteSvg,
  'volume-up': VolumeUpSvg, wand: WandSvg, website: WebsiteSvg,
  weight: WeightSvg, 'wi-fi': WiFiSvg, 'window-new': WindowNewSvg,
  world: WorldSvg, x: XSvg,
};

// ─── Icon component ───────────────────────────────────────────────────────────

export type IconProps = {
  name:   IconName;
  size?:  number;
  /**
   * Icon fill colour.
   * When omitted inside a <Button>, inherits the button's textColor via
   * ButtonColorContext — the React Native equivalent of `fill: currentColor`.
   * Falls back to textPrimary (#111111) when no context is present.
   */
  color?: string;
  style?: ViewStyle;
};

export function Icon({ name, size = 24, color, style }: IconProps) {
  // currentColor: inherit the parent Button's textColor when no explicit color is given
  const buttonColor   = useContext(ButtonColorContext);
  const resolvedColor = color ?? buttonColor ?? '#111111';

  const SvgComp = ICON_MAP[name];
  if (!SvgComp) {
    return (
      <View
        style={[
          {
            width:           size,
            height:          size,
            borderRadius:    2,
            backgroundColor: 'rgba(175,175,175,0.3)',
          },
          style,
        ]}
      />
    );
  }
  return (
    <View style={style}>
      <SvgComp width={size} height={size} fill={resolvedColor} color={resolvedColor} />
    </View>
  );
}
