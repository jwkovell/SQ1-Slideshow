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

  }

}
