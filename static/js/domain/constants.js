export const BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';
export const CUSTOM_GEOIM_IMAGE_LAYER = 'custom_geiom_image_layer';
export const NOTIFICATION_LIFE_SPAN_MS = 10000;

export const Z_INDEX = {
    BASEMAP: -10,
};

export const MODE = {
    VISUALIZE: 'VISUALIZE',
    DUPLICATE: 'DUPLICATE',
    CREATION: 'CREATION',
    MODIFY: 'MODIFY',
    DELETE: 'DELETE',
    ASK_EXPERTISE: 'ASK_EXPERTISE',
    VALIDATE: 'VALIDATE',
    REJECT: 'REJECT',
};

export const ANNOTATION = {
    STATUS: {
        NEW: 'new',
        PRE_RELEASED: 'pre_released',
        RELEASED: 'released',
        REVIEW: 'review',
        VALIDATED: 'validated',
        REJECTED: 'rejected',
        DELETED: 'deleted',
    }
};
export const ANNOTATION_STATUS_AS_ARRAY = [
    'new',
    'pre_released',
    'released',
    'review',
    'validated',
    'rejected',
    'deleted',
];
export const VISIBLE_LAYERS_BY_DEFAULT = [
    ANNOTATION.STATUS.NEW,
    ANNOTATION.STATUS.RELEASED,
    ANNOTATION.STATUS.REVIEW,
    ANNOTATION.STATUS.VALIDATED,
];

export const ALLOWED_BING_MAPS = [
    {title: 'Aerial with labels', imagerySet: 'AerialWithLabels', visible: false},
    {title: 'Aerial', imagerySet: 'Aerial', visible: true},
];

export const IMAGES_NRG = [
    'NRG_Pleiades_20120912_RGBN_50cm_8bits_AOI_35_Montreal_QC',
    'NRG_Pleiades_20120912_RGBN_50cm_8bits_AOI_5_Edmunston_NB',
    'NRG_Pleiades_20120913_RGBN_50cm_8bits_AOI_27_StJohns_NL',
    'NRG_Pleiades_20121006_RGBN_50cm_8bits_AOI_34_Vancouver_BC',
    'NRG_Pleiades_20130609_RGBN_50cm_8bits_AOI_29_Ottawa_ON',
    'NRG_Pleiades_20130628_RGBN_50cm_8bits_AOI_32_Calgary_AB',
    'NRG_Pleiades_20130630_RGBN_50cm_8bits_AOI_16_Lethbridge_AB',
    'NRG_Pleiades_20130703_RGBN_50cm_8bits_AOI_23_Regina_SK',
    'NRG_Pleiades_20130715_RGBN_50cm_8bits_AOI_28_Quebec_QC',
    'NRG_Pleiades_20130801_RGBN_50cm_8bits_AOI_19_FortMacKay_AB',
    'NRG_Pleiades_20130806_RGBN_50cm_8bits_AOI_9_Firebag_AB',
    'NRG_Pleiades_20130822_RGBN_50cm_8bits_AOI_22_Kamloops_BC',
    'NRG_Pleiades_20130906_RGBN_50cm_8bits_AOI_7_PrinceRupert_BC',
    'NRG_Pleiades_20140609_RGBN_50cm_8bits_AOI_15_HayRiver_NWT',
    'NRG_Pleiades_20140609_RGBN_50cm_8bits_AOI_35_Montreal_QC',
    'NRG_Pleiades_20140715_RGBN_50cm_8bits_AOI_8_Kelowna_BC',
    'NRG_Pleiades_20140731_RGBN_50cm_8bits_AOI_17_PrinceGeorge_BC',
    'NRG_Pleiades_20140914_RGBN_50cm_8bits_AOI_18_ChiselLake_MB',
    'NRG_Pleiades_20140914_RGBN_50cm_8bits_AOI_34_Vancouver_BC',
    'NRG_Pleiades_20141012_RGBN_50cm_8bits_AOI_14_Prespatou_BC',
    'NRG_Pleiades_20141025_RGBN_50cm_8bits_AOI_1_Sherbrooke_QC',
    'NRG_Pleiades_20150503_RGBN_50cm_8bits_AOI_10_Windsor_QC',
    'NRG_Pleiades_20150503b_RGBN_50cm_8bits_AOI_10_Windsor_QC',
    'NRG_Pleiades_20150517_RGBN_50cm_8bits_AOI_30_Toronto_ON',
    'NRG_Pleiades_20150517_RGBN_50cm_8bits_AOI_6_Newmarket_ON',
    'NRG_Pleiades_20150519_RGBN_50cm_8bits_AOI_4_Kingston_ON',
    'NRG_Pleiades_20150606_RGBN_50cm_8bits_AOI_30_Toronto_ON',
    'NRG_Pleiades_20150607_RGBN_50cm_8bits_AOI_21_GrandeRiviere_QC',
    'NRG_Pleiades_20150614_RGBN_50cm_8bits_AOI_21_GrandeRiviere_QC',
    'NRG_Pleiades_20150615_RGBN_50cm_8bits_AOI_11_Halifax_NS',
    'NRG_Pleiades_20150619_RGBN_50cm_8bits_AOI_30_Toronto_ON',
    'NRG_Pleiades_20150807_RGBN_50cm_8bits_AOI_2_Aklavik_NWT',
    'NRG_Pleiades_20150813_RGBN_50cm_8bits_AOI_24_Chilliwack_BC',
    'NRG_Pleiades_20150813_RGBN_50cm_8bits_AOI_31_Winnipeg_MB',
    'NRG_Pleiades_20150817_RGBN_50cm_8bits_AOI_12_Carbonear_NL',
    'NRG_Pleiades_20150831_RGBN_50cm_8bits_AOI_3_Iqaluit_NU',
    'NRG_Pleiades_20150909_RGBN_50cm_8bits_AOI_13_FortResolution_NWT',
    'NRG_Pleiades_20150917_RGBN_50cm_8bits_AOI_5_Edmunston_NB',
    'NRG_Pleiades_20151010_RGBN_50cm_8bits_AOI_35_Montreal_QC',
    'NRG_Pleiades_20160620_RGBN_50cm_8bits_AOI_25_Sorel_QC',
];

export const IMAGES_RGB = [
    'RGB_Pleiades_20120912_RGBN_50cm_8bits_AOI_35_Montreal_QC',
    'RGB_Pleiades_20120912_RGBN_50cm_8bits_AOI_5_Edmunston_NB',
    'RGB_Pleiades_20120913_RGBN_50cm_8bits_AOI_27_StJohns_NL',
    'RGB_Pleiades_20121006_RGBN_50cm_8bits_AOI_34_Vancouver_BC',
    'RGB_Pleiades_20130609_RGBN_50cm_8bits_AOI_29_Ottawa_ON',
    'RGB_Pleiades_20130628_RGBN_50cm_8bits_AOI_32_Calgary_AB',
    'RGB_Pleiades_20130630_RGBN_50cm_8bits_AOI_16_Lethbridge_AB',
    'RGB_Pleiades_20130703_RGBN_50cm_8bits_AOI_23_Regina_SK',
    'RGB_Pleiades_20130715_RGBN_50cm_8bits_AOI_28_Quebec_QC',
    'RGB_Pleiades_20130801_RGBN_50cm_8bits_AOI_19_FortMacKay_AB',
    'RGB_Pleiades_20130806_RGBN_50cm_8bits_AOI_9_Firebag_AB',
    'RGB_Pleiades_20130822_RGBN_50cm_8bits_AOI_22_Kamloops_BC',
    'RGB_Pleiades_20130906_RGBN_50cm_8bits_AOI_7_PrinceRupert_BC',
    'RGB_Pleiades_20140609_RGBN_50cm_8bits_AOI_15_HayRiver_NWT',
    'RGB_Pleiades_20140609_RGBN_50cm_8bits_AOI_35_Montreal_QC',
    'RGB_Pleiades_20140715_RGBN_50cm_8bits_AOI_8_Kelowna_BC',
    'RGB_Pleiades_20140731_RGBN_50cm_8bits_AOI_17_PrinceGeorge_BC',
    'RGB_Pleiades_20140914_RGBN_50cm_8bits_AOI_18_ChiselLake_MB',
    'RGB_Pleiades_20140914_RGBN_50cm_8bits_AOI_34_Vancouver_BC',
    'RGB_Pleiades_20141012_RGBN_50cm_8bits_AOI_14_Prespatou_BC',
    'RGB_Pleiades_20141025_RGBN_50cm_8bits_AOI_1_Sherbrooke_QC',
    'RGB_Pleiades_20150503_RGBN_50cm_8bits_AOI_10_Windsor_QC',
    'RGB_Pleiades_20150503b_RGBN_50cm_8bits_AOI_10_Windsor_QC',
    'RGB_Pleiades_20150517_RGBN_50cm_8bits_AOI_30_Toronto_ON',
    'RGB_Pleiades_20150517_RGBN_50cm_8bits_AOI_6_Newmarket_ON',
    'RGB_Pleiades_20150519_RGBN_50cm_8bits_AOI_4_Kingston_ON',
    'RGB_Pleiades_20150606_RGBN_50cm_8bits_AOI_30_Toronto_ON',
    'RGB_Pleiades_20150607_RGBN_50cm_8bits_AOI_21_GrandeRiviere_QC',
    'RGB_Pleiades_20150614_RGBN_50cm_8bits_AOI_21_GrandeRiviere_QC',
    'RGB_Pleiades_20150615_RGBN_50cm_8bits_AOI_11_Halifax_NS',
    'RGB_Pleiades_20150619_RGBN_50cm_8bits_AOI_30_Toronto_ON',
    'RGB_Pleiades_20150807_RGBN_50cm_8bits_AOI_2_Aklavik_NWT',
    'RGB_Pleiades_20150813_RGBN_50cm_8bits_AOI_24_Chilliwack_BC',
    'RGB_Pleiades_20150813_RGBN_50cm_8bits_AOI_31_Winnipeg_MB',
    'RGB_Pleiades_20150817_RGBN_50cm_8bits_AOI_12_Carbonear_NL',
    'RGB_Pleiades_20150831_RGBN_50cm_8bits_AOI_3_Iqaluit_NU',
    'RGB_Pleiades_20150909_RGBN_50cm_8bits_AOI_13_FortResolution_NWT',
    'RGB_Pleiades_20150917_RGBN_50cm_8bits_AOI_5_Edmunston_NB',
    'RGB_Pleiades_20151010_RGBN_50cm_8bits_AOI_35_Montreal_QC',
    'RGB_Pleiades_20160620_RGBN_50cm_8bits_AOI_25_Sorel_QC',
];
