import type { BlogPost } from "../data/blogData";

const ALLOWED_CATEGORIES = [
  "AI SEARCH SEO",
  "LOCAL SEO",
  "ECOMMERCE SEO",
  "TECHNICAL SEO",
  "SEO CASE STUDIES",
] as const;

const getDuplicateValues = (values: string[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  values.forEach((value) => {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  });

  return Array.from(duplicates);
};

const isValidIsoDate = (value?: string) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

const stripHtml = (html: string) => {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
};

export const validateBlogPosts = (posts: BlogPost[]) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const articleIds = posts
    .map((post) => post.id?.trim())
    .filter(Boolean);

  const articleIdSet = new Set(articleIds);

  const duplicateArticleIds = getDuplicateValues(articleIds);

  duplicateArticleIds.forEach((id) => {
    errors.push(`Duplicate article ID found: "${id}"`);
  });

  posts.forEach((post, index) => {
    const articleName = post.id?.trim() || `Article number ${index + 1}`;
    const articleLabel = `[${articleName}]`;

    // Required core fields
    if (!post.id?.trim()) {
      errors.push(`${articleLabel} Article ID is missing.`);
    }

    if (!post.title?.trim()) {
      errors.push(`${articleLabel} Article title is missing.`);
    }

    if (!post.author?.trim()) {
      errors.push(`${articleLabel} Author is missing.`);
    }

    if (!post.category?.trim()) {
      errors.push(`${articleLabel} Category is missing.`);
    }

    if (!post.readTime?.trim()) {
      warnings.push(`${articleLabel} Read time is missing.`);
    }

    if (!post.image?.trim()) {
      errors.push(`${articleLabel} Featured image path is missing.`);
    }

    if (!post.content?.trim()) {
      errors.push(`${articleLabel} Article content is empty.`);
    }

    // Category validation
    if (
      post.category &&
      !ALLOWED_CATEGORIES.includes(
        post.category.toUpperCase() as (typeof ALLOWED_CATEGORIES)[number],
      )
    ) {
      errors.push(
        `${articleLabel} Invalid category "${post.category}". ` +
          `Allowed categories: ${ALLOWED_CATEGORIES.join(", ")}.`,
      );
    }

    // SEO metadata
    if (!post.seoTitle?.trim()) {
      warnings.push(`${articleLabel} seoTitle is missing.`);
    } else if (post.seoTitle.length < 45 || post.seoTitle.length > 65) {
      warnings.push(
        `${articleLabel} seoTitle length is ${post.seoTitle.length} characters. Recommended range: 45–65.`,
      );
    }

    if (!post.metaDescription?.trim()) {
      warnings.push(`${articleLabel} metaDescription is missing.`);
    } else if (
      post.metaDescription.length < 140 ||
      post.metaDescription.length > 165
    ) {
      warnings.push(
        `${articleLabel} metaDescription length is ${post.metaDescription.length} characters. Recommended range: 140–165.`,
      );
    }

    if (!post.ogTitle?.trim()) {
      warnings.push(`${articleLabel} ogTitle is missing.`);
    }

    if (!post.socialDescription?.trim()) {
      warnings.push(`${articleLabel} socialDescription is missing.`);
    }

    if (!post.excerpt?.trim()) {
      warnings.push(`${articleLabel} excerpt is missing.`);
    }

    if (!post.imageAlt?.trim()) {
      warnings.push(`${articleLabel} imageAlt is missing.`);
    }

    // Publication dates
    if (!post.datePublished) {
      warnings.push(`${articleLabel} datePublished is missing.`);
    } else if (!isValidIsoDate(post.datePublished)) {
      errors.push(
        `${articleLabel} datePublished must use valid YYYY-MM-DD format.`,
      );
    }

    if (!post.dateModified) {
      warnings.push(`${articleLabel} dateModified is missing.`);
    } else if (!isValidIsoDate(post.dateModified)) {
      errors.push(
        `${articleLabel} dateModified must use valid YYYY-MM-DD format.`,
      );
    }

    if (
      isValidIsoDate(post.datePublished) &&
      isValidIsoDate(post.dateModified) &&
      post.dateModified! < post.datePublished!
    ) {
      errors.push(
        `${articleLabel} dateModified cannot be earlier than datePublished.`,
      );
    }

    // Related post validation
    const relatedPostIds = post.relatedPostIds || [];

    const duplicateRelatedIds = getDuplicateValues(relatedPostIds);

    duplicateRelatedIds.forEach((relatedId) => {
      errors.push(
        `${articleLabel} Duplicate relatedPostId found: "${relatedId}".`,
      );
    });

    relatedPostIds.forEach((relatedId) => {
      if (relatedId === post.id) {
        errors.push(
          `${articleLabel} Article cannot contain itself in relatedPostIds.`,
        );
      }

      if (!articleIdSet.has(relatedId)) {
        errors.push(
          `${articleLabel} Broken relatedPostId "${relatedId}". No matching article exists.`,
        );
      }
    });

    // TOC validation
    if (!post.toc || post.toc.length === 0) {
      warnings.push(`${articleLabel} Table of contents is empty.`);
    } else {
      const tocIds = post.toc
        .map((item) => item.id?.trim())
        .filter(Boolean);

      const duplicateTocIds = getDuplicateValues(tocIds);

      duplicateTocIds.forEach((tocId) => {
        errors.push(`${articleLabel} Duplicate TOC ID found: "${tocId}".`);
      });

      post.toc.forEach((tocItem) => {
        if (!tocItem.id?.trim()) {
          errors.push(`${articleLabel} A TOC item has no ID.`);
          return;
        }

        if (!tocItem.title?.trim()) {
          errors.push(
            `${articleLabel} TOC item "${tocItem.id}" has no title.`,
          );
        }

        const doubleQuoteId = `id="${tocItem.id}"`;
        const singleQuoteId = `id='${tocItem.id}'`;

        if (
          !post.content.includes(doubleQuoteId) &&
          !post.content.includes(singleQuoteId)
        ) {
          errors.push(
            `${articleLabel} TOC ID "${tocItem.id}" does not exist inside article content.`,
          );
        }
      });
    }

    // FAQ validation
    const faqItems = post.faqItems || [];
    const visibleArticleText = stripHtml(post.content).toLowerCase();

    if (faqItems.length > 0) {
      const faqQuestions = faqItems
        .map((item) => item.question?.trim().toLowerCase())
        .filter(Boolean);

      const duplicateFaqQuestions = getDuplicateValues(faqQuestions);

      duplicateFaqQuestions.forEach((question) => {
        errors.push(
          `${articleLabel} Duplicate FAQ question found: "${question}".`,
        );
      });

      faqItems.forEach((faq, faqIndex) => {
        if (!faq.question?.trim()) {
          errors.push(
            `${articleLabel} FAQ number ${faqIndex + 1} has no question.`,
          );
        }

        if (!faq.answer?.trim()) {
          errors.push(
            `${articleLabel} FAQ number ${faqIndex + 1} has no answer.`,
          );
        }

        if (
          faq.question?.trim() &&
          !visibleArticleText.includes(faq.question.trim().toLowerCase())
        ) {
          warnings.push(
            `${articleLabel} FAQ question is in faqItems but not visible in article content: "${faq.question}".`,
          );
        }
      });
    }

    // Duplicate CTA validation
    const hasCustomCta = post.content.includes("cta-premium-block");

    if (hasCustomCta && post.showStandardCta !== false) {
      errors.push(
        `${articleLabel} Custom CTA exists but showStandardCta is not false. This may create duplicate CTAs.`,
      );
    }

    if (
      post.showStandardCta === true &&
      !post.primaryService?.title?.trim()
    ) {
      warnings.push(
        `${articleLabel} showStandardCta is true but primaryService is missing.`,
      );
    }
  });

  if (errors.length === 0 && warnings.length === 0) {
    console.log(
      `✅ Blog validation passed. ${posts.length} articles checked.`,
    );

    return {
      isValid: true,
      errors,
      warnings,
    };
  }

  console.group(
    `%cBlog validation: ${errors.length} error(s), ${warnings.length} warning(s)`,
    "font-weight: bold; font-size: 14px;",
  );

  if (errors.length > 0) {
    console.group(`❌ Errors (${errors.length})`);

    errors.forEach((error) => {
      console.error(error);
    });

    console.groupEnd();
  }

  if (warnings.length > 0) {
    console.group(`⚠️ Warnings (${warnings.length})`);

    warnings.forEach((warning) => {
      console.warn(warning);
    });

    console.groupEnd();
  }

  console.groupEnd();

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};