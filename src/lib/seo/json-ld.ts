import { brandConfig, urls } from "@/config/site";

export function createOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: brandConfig.product.name,
        url: urls.origin,
    };
}

export function createPersonJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: brandConfig.creator.name,
    };
}