<?php

namespace Drupal\sq1_slideshow\Plugin\views\style;

use Drupal\core\form\FormStateInterface;
use Drupal\views\Plugin\views\style\StylePluginBase;

/**
 * Style plugin to render a slideshow.
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "sq1_slideshow",
 *   title = @Translation("SQ1 Slideshow"),
 *   help = @Translation("Render a slideshow."),
 *   theme = "views_view_sq1_slideshow",
 *   display_types = { "normal" }
 * )
 */
class Sq1Slideshow extends StylePluginBase {

  protected function defineOptions() {
    $options = parent::defineOptions();

    $options['image_field'] = ['default' => ''];
    $options['include_title'] = ['default' => 1];
    $options['link_slides'] = ['default' => 1];
    $options['autoplay'] = ['default' => 1];
    $options['slides_per_entity'] = ['default' => 1];
    $options['slide_shape'] = ['default' => 'rectangular'];
    $options['slide_shadow'] = ['default' => 'drop-shadow'];

    return $options;
  }

  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);

    $options = [
      '' => 'Select an Image field',
    ];

    $field_map = \Drupal::entityManager()->getFieldMap();
    $node_field_map = $field_map['node'];

    foreach ($node_field_map as $field_key => $field_value) {

      if ($field_value['type'] == 'image') {

        $options[$field_key] = $field_key . ' (' . implode(', ', $field_value['bundles']) . ')';

      }

    }

    $form['image_field'] = [
      '#title' => $this->t('Image field'),
      '#description' => $this->t('Field that will be used for the slide image.'),
      '#type' => 'select',
      '#default_value' => $this->options['image_field'],
      '#options' => $options,
    ];

    $form['include_title'] = [
      '#type' => 'select',
      '#title' => $this->t('Include title'),
      '#default_value' => $this->options['include_title'],
      '#options' => [
        1 => $this->t('Yes'),
        0 => $this->t('No'),
      ]
    ];

    $form['link_slides'] = [
      '#type' => 'select',
      '#title' => $this->t('Link slides'),
      '#default_value' => $this->options['link_slides'],
      '#options' => [
        1 => $this->t('Yes'),
        0 => $this->t('No'),
      ]
    ];

    $form['autoplay'] = [
      '#type' => 'select',
      '#title' => $this->t('Autoplay'),
      '#default_value' => $this->options['autoplay'],
      '#options' => [
        1 => $this->t('Yes'),
        0 => $this->t('No'),
      ]
    ];

    $form['slide_shape'] = [
      '#type' => 'select',
      '#title' => $this->t('Slide shape'),
      '#default_value' => $this->options['slide_shape'],
      '#options' => [
        'rectangular' => $this->t('Rectangular'),
        'rounded' => $this->t('Rounded'),
      ]
    ];

    $form['slide_shadow'] = [
      '#type' => 'select',
      '#title' => $this->t('Slide shadow'),
      '#default_value' => $this->options['slide_shadow'],
      '#options' => [
        'drop-shadow' => $this->t('Drop shadow'),
        'drop-and-inset-shadow' => $this->t('Drop and inset shadow'),
        'inset-shadow' => $this->t('Inset shadow'),
        'no-shadow' => $this->t('No shadow'),
      ]
    ];

    $form['slides_per_entity'] = [
      '#type' => 'number',
      '#title' => $this->t('Slides per entity'),
      '#min' => 0,
      '#max' => 10,
      '#default_value' => $this->options['slides_per_entity'],
    ];

  }

}
