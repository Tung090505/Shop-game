import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image }) => {
    const siteTitle = "ShopNickTFT - Hệ thống bán Acc TFT & Game số 1 Việt Nam";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDesc = "ShopNickTFT chuyên cung cấp tài khoản TFT Pet Tím, Sàn Tím, Acc LOL, Valorant giá rẻ. Giao dịch tự động 100%, bảo mật tuyệt đối.";
    const siteUrl = window.location.origin;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            <meta name="keywords" content={keywords || "shop tft, mua acc tft, tft pet tim, shopnicktft, nap tien game"} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:image" content={image || `${siteUrl}/logo-og.png`} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={siteUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description || defaultDesc} />
            <meta property="twitter:image" content={image || `${siteUrl}/logo-og.png`} />
        </Helmet>
    );
};

export default SEO;
